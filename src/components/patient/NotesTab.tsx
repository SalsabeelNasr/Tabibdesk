"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { RiFileTextLine, RiTimeLine } from "@remixicon/react"

interface DoctorNote {
  id: string
  patient_id: string
  note: string
  created_at: string
}

interface NotesTabProps {
  notes: DoctorNote[]
  patient?: any
}

export function NotesTab({ notes, patient: _patient }: NotesTabProps) {
  // Sort notes by date (newest first)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "new clinical investigation"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Past Notes Section */}
      {sortedNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RiFileTextLine className="mx-auto size-12 text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">No notes yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note) => {
            return (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">
                      {new Date(note.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <RiTimeLine className="size-4" />
                      <span>{formatRelativeTime(note.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {note.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

