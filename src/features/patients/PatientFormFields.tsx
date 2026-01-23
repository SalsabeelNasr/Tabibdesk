"use client"

import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"

export interface PatientFormData {
  first_name: string
  last_name: string
  phone: string
  email?: string
  gender?: string
  date_of_birth?: string
  age?: number
}

interface PatientFormFieldsProps {
  formData: PatientFormData
  onChange: (data: PatientFormData) => void
  errors?: Partial<Record<keyof PatientFormData, string>>
  showEmail?: boolean
  showGender?: boolean
  showDateOfBirth?: boolean
  showAge?: boolean
}

export function PatientFormFields({
  formData,
  onChange,
  errors = {},
  showEmail = false,
  showGender = false,
  showDateOfBirth = false,
  showAge = false,
}: PatientFormFieldsProps) {
  const updateField = <K extends keyof PatientFormData>(
    field: K,
    value: PatientFormData[K],
  ) => {
    onChange({ ...formData, [field]: value })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      updateField("date_of_birth", value)
      if (showAge) {
        updateField("age", undefined) // Clear age if DOB is set
      }
    } else {
      updateField("date_of_birth", undefined)
    }
  }

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      const ageNum = parseInt(value, 10)
      if (!isNaN(ageNum) && ageNum > 0) {
        updateField("age", ageNum)
        if (showDateOfBirth) {
          updateField("date_of_birth", undefined) // Clear DOB if age is set
        }
      }
    } else {
      updateField("age", undefined)
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

      {(showDateOfBirth || showAge) && (
        <div className="grid grid-cols-2 gap-4">
          {showDateOfBirth && (
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={handleDateChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}
          {showAge && (
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="150"
                value={formData.age || ""}
                onChange={handleAgeChange}
                placeholder="Enter age"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
