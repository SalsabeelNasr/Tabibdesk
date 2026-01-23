/**
 * Feature Resolution Logic
 * Merges plan-allowed features with clinic-specific overrides
 * to produce the effective feature flags
 */

import type { FeatureKey } from "./settings.types"

/**
 * Resolve effective features based on plan ceiling and clinic overrides
 * 
 * Rules:
 * 1. If planAllowed[key] === false → always false (LOCKED by plan, cannot be enabled)
 * 2. If planAllowed[key] === true → use clinicOverrides[key] ?? true (default enabled)
 * 
 * @param planAllowed - What the plan tier allows (ceiling)
 * @param clinicOverrides - Clinic-specific toggles (can only disable, not enable locked features)
 * @returns Effective feature flags that determine actual access
 */
export function resolveEffectiveFeatures(
  planAllowed: Record<FeatureKey, boolean>,
  clinicOverrides: Partial<Record<FeatureKey, boolean>> = {}
): Record<FeatureKey, boolean> {
  const effective = {} as Record<FeatureKey, boolean>

  // Iterate through all features
  for (const key in planAllowed) {
    const featureKey = key as FeatureKey
    const allowedByPlan = planAllowed[featureKey]

    if (!allowedByPlan) {
      // Feature locked by plan - always false
      effective[featureKey] = false
    } else {
      // Feature allowed by plan - check clinic override
      // If no override exists, default to enabled (true)
      effective[featureKey] = clinicOverrides[featureKey] ?? true
    }
  }

  return effective
}

/**
 * Check if a specific feature is locked by the plan
 */
export function isFeatureLocked(
  featureKey: FeatureKey,
  planAllowed: Record<FeatureKey, boolean>
): boolean {
  return !planAllowed[featureKey]
}

/**
 * Get list of features that are locked by the plan
 */
export function getLockedFeatures(
  planAllowed: Record<FeatureKey, boolean>
): FeatureKey[] {
  return (Object.keys(planAllowed) as FeatureKey[]).filter(
    (key) => !planAllowed[key]
  )
}

/**
 * Get list of features that are enabled (effective = true)
 */
export function getEnabledFeatures(
  effective: Record<FeatureKey, boolean>
): FeatureKey[] {
  return (Object.keys(effective) as FeatureKey[]).filter(
    (key) => effective[key]
  )
}
