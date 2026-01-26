"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import {
  RiMicLine,
  RiSendPlaneLine,
  RiFileCopyLine,
  RiPauseLine,
  RiPlayLine,
  RiStopLine,
  RiVoiceprintLine,
  RiTimeLine,
  RiRobot2Line,
  RiCheckboxCircleLine,
  RiCloseLine as RiCloseIcon,
  RiFileTextLine,
  RiAddLine,
} from "@remixicon/react"
import { cx } from "@/lib/utils"

const checklistItems = [
  { id: "vitals", label: "Vitals Recorded", regex: /vital|bp|blood pressure|temperature|pulse|heart rate/i },
  { id: "complaint", label: "Chief Complaint", regex: /complaint|complain|present|symptom/i },
  { id: "examination", label: "Physical Examination", regex: /exam|examin|inspect|palpat|auscult/i },
  { id: "diagnosis", label: "Diagnosis", regex: /diagnos|condition|disease/i },
  { id: "treatment", label: "Treatment Plan", regex: /treat|prescri|medicat|therapy|plan/i },
  { id: "labs", label: "Lab Orders", regex: /lab|test|blood|urine|x-ray|scan/i },
  { id: "followup", label: "Follow-up Scheduled", regex: /follow.?up|return|revisit|next visit/i },
]

interface DoctorNote {
  id: string
  patient_id: string
  note: string
  created_at: string
}

interface Transcription {
  id: string
  patient_id: string
  audio_url: string | null
  transcription_text: string
  duration_seconds: number
  created_at: string
  status: "processing" | "completed" | "failed"
}

interface ClinicalNotesTabProps {
  notes: DoctorNote[]
  transcriptions: Transcription[]
  patient?: any
  onSaveNote?: (note: string) => void
}

type ChatMessage = {
  id: string
  type: "note" | "transcription" | "new"
  content: string
  created_at: string
  audio_url?: string | null
  status?: string
  duration_seconds?: number
  extracted?: boolean
}

export function ClinicalNotesTab({
  notes,
  transcriptions,
  onSaveNote,
}: ClinicalNotesTabProps) {
  const [newNote, setNewNote] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [lastDetectedItem, setLastDetectedItem] = useState<string | null>(null)
  
  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  // Merge notes and transcriptions into a unified timeline
  const allMessages = useMemo(() => {
    const merged: ChatMessage[] = [
      ...notes.map((n) => ({
        id: n.id,
        type: "note" as const,
        content: n.note,
        created_at: n.created_at,
      })),
      ...transcriptions.map((t) => ({
        id: t.id,
        type: "transcription" as const,
        content: t.transcription_text,
        created_at: t.created_at,
        audio_url: t.audio_url,
        status: t.status,
        duration_seconds: t.duration_seconds,
      })),
    ]

    const sorted = merged.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Check if there's an entry for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const hasTodayEntry = sorted.some(m => {
      const d = new Date(m.created_at)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime()
    })

    if (!hasTodayEntry) {
      // Add a virtual "New Session" for today
      sorted.unshift({
        id: "new-today",
        type: "new",
        content: "",
        created_at: new Date().toISOString(),
      })
    }

    return sorted
  }, [notes, transcriptions])

  // Selected message state - Default to the "New" entry if it exists
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  // Initialize selectedMessageId
  useMemo(() => {
    if (!selectedMessageId && allMessages.length > 0) {
      setSelectedMessageId(allMessages[0].id)
    }
  }, [allMessages])

  const selectedMessage = useMemo(() => 
    allMessages.find(m => m.id === selectedMessageId) || (allMessages.length > 0 ? allMessages[0] : null)
  , [allMessages, selectedMessageId])

  // Group messages for the sidebar history
  const historyGroups = useMemo(() => {
    const groups: { label: string; messages: ChatMessage[] }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const todayMsgs: ChatMessage[] = []
    const yesterdayMsgs: ChatMessage[] = []
    const olderMsgs: ChatMessage[] = []

    allMessages.forEach((msg) => {
      const msgDate = new Date(msg.created_at)
      msgDate.setHours(0, 0, 0, 0)

      if (msgDate.getTime() === today.getTime()) {
        todayMsgs.push(msg)
      } else if (msgDate.getTime() === yesterday.getTime()) {
        yesterdayMsgs.push(msg)
      } else {
        olderMsgs.push(msg)
      }
    })

    if (todayMsgs.length > 0) groups.push({ label: "new clinical investigation", messages: todayMsgs })
    if (yesterdayMsgs.length > 0)
      groups.push({ label: "Yesterday", messages: yesterdayMsgs })
    if (olderMsgs.length > 0) groups.push({ label: "Older", messages: olderMsgs })

    return groups
  }, [allMessages])

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "processing":
        return "warning"
      case "failed":
        return "error"
      default:
        return "neutral"
    }
  }

  // Auto-detect checklist items as user types
  useMemo(() => {
    const lowerNote = newNote.toLowerCase()
    if (!lowerNote) return

    const newChecklist: Record<string, boolean> = { ...checklist }
    let detectedNew = false

    checklistItems.forEach((item) => {
      if (!checklist[item.id] && item.regex.test(lowerNote)) {
        newChecklist[item.id] = true
        setLastDetectedItem(item.label)
        detectedNew = true
      }
    })

    if (detectedNew) {
      setChecklist(newChecklist)
      setShowReminder(true)
      setTimeout(() => setShowReminder(false), 3000)
    }
  }, [newNote])

  const completedCount = Object.values(checklist).filter(Boolean).length
  const totalCount = checklistItems.length
  const completenessPercentage = Math.round((completedCount / totalCount) * 100)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSendNote = () => {
    if (newNote.trim()) {
      onSaveNote?.(newNote)
      setNewNote("")
      setChecklist({})
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Left Sidebar: History */}
      <div className="flex w-80 flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/30">
        <div className="flex-1 overflow-y-auto px-2 pt-4 pb-4">
          {historyGroups.map((group) => (
            <div key={group.label} className="mt-4 first:mt-0">
              {group.label !== "new clinical investigation" && (
                <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {group.label}
                </h4>
              )}
              <div className="mt-2 space-y-0.5">
                {group.messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={cx(
                      "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200",
                      selectedMessageId === msg.id 
                        ? "bg-primary-50 dark:bg-primary-900/20 shadow-sm" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-900"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cx(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                        msg.type === "new" ? "bg-primary-100 text-primary-600 animate-pulse" : "bg-gray-100 text-gray-500"
                      )}>
                        {msg.type === "new" ? <RiAddLine className="size-3" /> : (msg.type === "transcription" ? <RiVoiceprintLine className="size-3" /> : <RiFileTextLine className="size-3" />)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={cx(
                          "truncate font-medium",
                          selectedMessageId === msg.id ? "text-primary-700 dark:text-primary-400" : "text-gray-900 dark:text-gray-100"
                        )}>
                          {msg.type === "new" ? "New Clinical Investigation" : msg.content}
                        </p>
                        {msg.type !== "new" && (
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                            <span>{formatTime(msg.created_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Progress Card - Show below new clinical investigation section, before Older sections */}
              {group.label === "new clinical investigation" && (
                <div className="mt-4 px-2">
                  <Card className="shadow-sm border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RiCheckboxCircleLine className="size-5 text-primary-600" />
                          <CardTitle className="text-sm">Progress</CardTitle>
                        </div>
                        <span className="text-xs font-bold text-primary-600">{completenessPercentage}%</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div 
                          className="h-full bg-primary-600 transition-all duration-500 ease-out"
                          style={{ width: `${completenessPercentage}%` }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2.5">
                        {checklistItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className={cx(
                              "size-4 rounded-full border flex items-center justify-center transition-all duration-300",
                              checklist[item.id] 
                                ? "bg-primary-600 border-primary-600 text-white scale-110 shadow-sm" 
                                : "border-gray-200 dark:border-gray-700"
                            )}>
                              {checklist[item.id] && <RiCheckboxCircleLine className="size-3" />}
                            </div>
                            <span className={cx(
                              "text-[13px] transition-colors",
                              checklist[item.id] ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-400"
                            )}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 pt-4 pb-4 lg:px-6 lg:pb-6">
          <div className="mx-auto max-w-4xl h-full">
            {selectedMessage?.type === "new" ? (
              /* ACTIVE SESSION VIEW (Full Page Input) */
              <div className="flex flex-col h-full">
                <div className="w-full flex flex-col h-full">
                  {/* Header with Badge and Record Controls */}
                  <div className="flex items-center justify-between mb-2 flex-shrink-0">
                    <Badge variant="default" className="px-3 py-1 text-xs animate-pulse">Active Session</Badge>
                    <div className="flex items-center gap-2">
                      {isRecording ? (
                        <>
                          <button
                            onClick={handlePauseResume}
                            className={cx(
                              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-sm",
                              isPaused
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                            )}
                            title={isPaused ? "Resume Recording" : "Pause Recording"}
                          >
                            {isPaused ? (
                              <>
                                <RiPlayLine className="size-4" />
                                <span className="text-xs">Resume</span>
                              </>
                            ) : (
                              <>
                                <RiPauseLine className="size-4" />
                                <span className="text-xs">Pause</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleStopRecording}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all font-medium text-sm"
                            title="End Recording"
                          >
                            <RiStopLine className="size-4" />
                            <span className="text-xs">End</span>
                          </button>
                          <div className="flex items-center gap-2 px-3 py-2">
                            <div className="size-2 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-xs font-medium text-red-600 dark:text-red-400">Recording</span>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={handleStartRecording}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 transition-all font-medium text-sm"
                          title="Start Recording"
                        >
                          <RiMicLine className="size-5" />
                          <span className="text-xs">Record</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Input Field with Border and Rounded Corners */}
                  <div className="relative flex-1 flex flex-col min-h-0">
                    {/* Highlight Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-base text-transparent leading-relaxed rounded-2xl p-6 z-10"
                    >
                      {newNote.split(/(\s+)/).map((word, i) => {
                        const matchedChecklist = checklistItems.find(item => item.regex.test(word.toLowerCase()));
                        if (matchedChecklist) {
                          return <span key={i} className="bg-primary-100/30 dark:bg-primary-900/20 rounded px-1 text-transparent border-b-2 border-primary-500/30 font-medium">{word}</span>;
                        }
                        return word;
                      })}
                    </div>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Start typing your clinical observations here... AI will automatically detect checklist items."
                      className="w-full flex-1 resize-none bg-white dark:bg-gray-900 text-base text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 leading-relaxed rounded-2xl border border-gray-200 dark:border-gray-800 p-6 pb-20 shadow-sm focus:ring-2 focus:ring-primary-500/10 transition-all"
                    />
                    
                    {/* Reminder Popup */}
                    {showReminder && (
                      <div className="absolute bottom-24 left-6 right-6 animate-in fade-in slide-in-from-bottom-2 duration-300 z-20">
                        <div className="flex w-fit mx-auto items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg dark:bg-white dark:text-gray-900">
                          <RiCheckboxCircleLine className="size-4 text-emerald-400 dark:text-emerald-600" />
                          <span className="text-xs font-medium">Detected: {lastDetectedItem}</span>
                          <button onClick={() => setShowReminder(false)} className="ml-2 rounded-full p-0.5 hover:bg-gray-800 dark:hover:bg-gray-100">
                            <RiCloseIcon className="size-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Bar at Bottom */}
                    <div className="absolute bottom-6 right-6 z-20">
                      <Button
                        onClick={handleSendNote}
                        disabled={!newNote.trim() && !isRecording}
                        className="px-6 rounded-xl"
                      >
                        <RiSendPlaneLine className="mr-2 size-4" />
                        Save Investigation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedMessage ? (
              /* HISTORICAL ENTRY VIEW (Detail View) */
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div className={cx(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                        selectedMessage.type === "transcription" 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                          : "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      )}>
                        {selectedMessage.type === "transcription" ? (
                          <RiVoiceprintLine className="size-5" />
                        ) : (
                          <RiFileTextLine className="size-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">
                          {formatDate(selectedMessage.created_at)}
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{formatTime(selectedMessage.created_at)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(selectedMessage.created_at)}</span>
                          {selectedMessage.duration_seconds && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <RiTimeLine className="size-4" />
                                {formatDuration(selectedMessage.duration_seconds)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedMessage.type === "transcription" && (
                      selectedMessage.extracted ? (
                        <Badge variant="success" className="px-3 py-1">
                          Extracted
                        </Badge>
                      ) : selectedMessage.status ? (
                        <Badge variant={getStatusColor(selectedMessage.status)} className="px-3 py-1">
                          {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                        </Badge>
                      ) : null
                    )}
                  </div>

                  <div className="mt-10">
                    {selectedMessage.audio_url && (
                      <div className="mb-8 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <audio controls className="w-full">
                          <source src={selectedMessage.audio_url} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                    
                    <div className="relative group">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary-100 dark:bg-primary-900/30 rounded-full" />
                      <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-800 dark:text-gray-200 pl-4">
                        {selectedMessage.content}
                      </p>
                    </div>

                    {selectedMessage.type === "transcription" && selectedMessage.status === "completed" && !selectedMessage.extracted && (
                      <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end">
                        <Button variant="primary" size="sm" className="gap-2 px-6">
                          <RiRobot2Line className="size-4" />
                          Extract with AI
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                 <div className="text-center">
                    <RiFileCopyLine className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a record to view details</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
