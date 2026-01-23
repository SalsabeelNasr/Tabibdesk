# Settings & Feature Flags System

Complete feature flag and settings management system for TabibDesk.

## Overview

This system implements:
- ✅ Per-clinic feature flags
- ✅ Plan-tier based feature locks (Solo/Multi/More)
- ✅ Role-based permissions (doctor/assistant/manager)
- ✅ Sidebar visibility control
- ✅ Route protection
- ✅ Settings UI with feature toggles

## Architecture

```
┌─────────────────┐
│  Plan Catalog   │ (Solo/Multi/More)
│   (Ceiling)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│ Clinic Override │────▶│ Feature Resolver │
│   (Toggles)     │     └────────┬─────────┘
└─────────────────┘              │
                                 ▼
                        ┌─────────────────┐
                        │  useFeatures()  │
                        │      Hook       │
                        └────────┬────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
           ┌─────────┐    ┌──────────┐   ┌──────────┐
           │ Sidebar │    │ Settings │   │  Guards  │
           │ Filter  │    │    UI    │   │  Routes  │
           └─────────┘    └──────────┘   └──────────┘
```

## File Structure

```
src/features/settings/
├── settings.types.ts       # Type definitions
├── planCatalog.ts          # Plan tier feature matrix
├── featureResolver.ts      # Feature resolution logic
├── featureMetadata.ts      # UI display metadata
├── useFeatures.ts          # React hook for feature access
└── README.md               # This file

src/api/
└── settings.api.ts         # Settings API (mock/backend)

src/components/guards/
└── FeatureGate.tsx         # Route protection component
```

## Usage

### 1. Check if a feature is enabled

```typescript
import { useFeatures } from "@/features/settings/useFeatures"

function MyComponent() {
  const { effective } = useFeatures()
  
  if (effective.tasks) {
    // Feature is enabled
  }
}
```

### 2. Protect a route

```typescript
import { FeatureGate } from "@/components/guards/FeatureGate"

export default function TasksPage() {
  return (
    <FeatureGate feature="tasks">
      <TasksContent />
    </FeatureGate>
  )
}
```

### 3. Check if feature is locked by plan

```typescript
import { useFeatures } from "@/features/settings/useFeatures"

function UpgradePrompt() {
  const { isLocked } = useFeatures()
  
  if (isLocked("ai_summary")) {
    return <div>Upgrade to More plan to unlock AI features</div>
  }
}
```

### 4. Filter navigation based on features

```typescript
// Already implemented in Sidebar.tsx
const { effective } = useFeatures()
const filteredNav = navigation.filter(item => 
  !item.featureKey || effective[item.featureKey]
)
```

## Plan Tiers

### Solo ($49/month)
- Patients ✅
- Appointments ✅
- Medications ✅
- Files ✅
- Automated tasks ✅

### Multi ($99/month)
- Everything in Solo
- Tasks ✅
- Insights ✅
- Labs ✅
- Reminders ✅

### More ($199/month)
- Everything in Multi
- AI Summary ✅
- AI Dictation ✅
- AI Lab Extraction ✅

## Feature Keys

```typescript
type FeatureKey =
  // Core modules
  | "patients"
  | "appointments"
  | "tasks"
  | "insights"
  // Optional modules
  | "labs"
  | "medications"
  | "files"
  | "reminders"
  // AI features
  | "ai_summary"
  | "ai_dictation"
  | "ai_lab_extraction"
```

## Permissions

### Who can toggle features?
- ✅ Manager role
- ✅ Doctors with `isManager: true` flag
- ❌ Assistants (read-only)

### Feature Toggle Rules
1. If plan doesn't allow feature → LOCKED (cannot enable)
2. If plan allows feature → Can toggle on/off per clinic
3. Clinic overrides only DISABLE, never ENABLE locked features

## API Layer

All settings data is managed through `src/api/settings.api.ts`:

```typescript
// Get current plan
const planInfo = await getPlanInfo()

// Get clinic settings
const settings = await getClinicSettings(clinicId)

// Get feature overrides
const overrides = await getClinicFeatureFlags(clinicId)

// Update a feature flag
await updateClinicFeatureFlag(clinicId, "tasks", true)
```

### Mock Data Storage
Currently uses `localStorage`:
- `tabibdesk-plan-info` - Plan tier
- `tabibdesk-clinic-settings` - Clinic details
- `tabibdesk-feature-flags` - Feature overrides

## Testing Scenarios

### Change Plan Tier (Demo)
```typescript
import * as settingsApi from "@/api/settings.api"

// Switch to Solo plan (most features locked)
await settingsApi.updatePlanTier("solo")

// Switch to Multi plan (team features unlocked)
await settingsApi.updatePlanTier("multi")

// Switch to More plan (all features unlocked)
await settingsApi.updatePlanTier("more")
```

### Toggle Feature for Clinic
1. Go to Settings → Modules tab
2. Toggle any feature (if allowed by plan)
3. Check sidebar - feature appears/disappears
4. Navigate to feature page - gate shows/hides content

### Test Locked Features
1. Set plan to Solo
2. Try to enable Tasks in Settings
3. Toggle is disabled, shows "Upgrade" badge
4. Click Upgrade → redirects to /pricing

## Mobile Responsive

- Settings tabs: Horizontal scroll on mobile
- Feature toggles: Full-width, stacked vertically
- Pricing page: Single column stack
- Sidebar: Collapses to mobile menu

## Error Handling

- If `useFeatures()` fails → Fail-open (allow all features)
- Loading states shown during data fetch
- Optimistic UI updates in Settings

## Future Backend Integration

To replace mock with real backend:

1. Update `src/api/settings.api.ts`
2. Replace localStorage with fetch calls
3. Add authentication headers
4. No component changes needed!

Example:
```typescript
export async function getPlanInfo(): Promise<PlanInfo> {
  const res = await fetch("/api/settings/plan", {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}
```

## Troubleshooting

### Feature not appearing in sidebar
- Check plan allows feature in `planCatalog.ts`
- Check feature not disabled in Settings
- Check `featureKey` set in `navigation.ts`

### "Feature Locked" showing incorrectly
- Verify plan tier in localStorage
- Check `PLAN_FEATURES` matrix in `planCatalog.ts`
- Clear localStorage and reinitialize

### TypeScript errors
- Ensure all role types include `"manager"`
- Check `FeatureKey` is imported from settings.types
- Verify navigation items have optional `featureKey`

## Contributing

When adding a new feature:

1. Add key to `FeatureKey` type in `settings.types.ts`
2. Add to plan matrix in `planCatalog.ts`
3. Add metadata in `featureMetadata.ts`
4. Add navigation item with `featureKey` in `navigation.ts`
5. Wrap route with `<FeatureGate>` component
6. Update this README

## Related Files

- `/src/lib/navigation.ts` - Navigation configuration
- `/src/components/shell/Sidebar.tsx` - Sidebar filtering
- `/src/app/(app)/settings/page.tsx` - Settings UI
- `/src/app/(app)/pricing/page.tsx` - Pricing page
