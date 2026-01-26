"use client"

import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { Textarea } from "@/components/Textarea"
import { RiFileTextLine } from "@remixicon/react"

export interface PatientFormData {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: string
  source?: string
  source_other?: string
  address?: string
  complaint?: string
}

interface PatientFormFieldsProps {
  formData: PatientFormData
  onChange: (data: PatientFormData) => void
  errors?: Partial<Record<keyof PatientFormData, string>>
  showEmail?: boolean
  showGender?: boolean
}

export function PatientFormFields({
  formData,
  onChange,
  errors = {},
  showEmail = true,
  showGender = false,
}: PatientFormFieldsProps) {
  const updateField = <K extends keyof PatientFormData>(
    field: K,
    value: PatientFormData[K],
  ) => {
    onChange({ ...formData, [field]: value })
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    updateField("source", value)
    // Clear source_other if not "other"
    if (value !== "other") {
      updateField("source_other", undefined)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            hasError={!!errors.first_name}
            placeholder="Enter first name"
            required
          />
          {errors.first_name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            hasError={!!errors.last_name}
            placeholder="Enter last name"
            required
          />
          {errors.last_name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          hasError={!!errors.phone}
          placeholder="+20 100 1234567"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
        )}
      </div>

      {showEmail && (
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            hasError={!!errors.email}
            placeholder="patient@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      )}

      {showGender && (
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            value={formData.gender || ""}
            onChange={(e) => updateField("gender", e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Select
          id="source"
          value={formData.source || ""}
          onChange={handleSourceChange}
        >
          <option value="">Select source</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="friend_recommendation">Friend Recommendation</option>
          <option value="walk_in">Walk In</option>
          <option value="other">Other</option>
        </Select>
      </div>

      {formData.source === "other" && (
        <div className="space-y-2">
          <Label htmlFor="source_other">Specify Other Source</Label>
          <Input
            id="source_other"
            value={formData.source_other || ""}
            onChange={(e) => updateField("source_other", e.target.value)}
            hasError={!!errors.source_other}
            placeholder="Enter source"
          />
          {errors.source_other && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.source_other}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="address">Address (Optional)</Label>
        <Input
          id="address"
          value={formData.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
          hasError={!!errors.address}
          placeholder="Enter address"
        />
        {errors.address && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="complaint" className="flex items-center gap-2">
          <RiFileTextLine className="size-4 text-gray-400" />
          <span>Complaint (Optional)</span>
        </Label>
        <Textarea
          id="complaint"
          value={formData.complaint || ""}
          onChange={(e) => updateField("complaint", e.target.value)}
          placeholder="Enter complaint"
          rows={3}
        />
      </div>
    </div>
  )
}
