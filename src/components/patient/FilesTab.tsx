"use client"

import { useState } from "react"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuIconWrapper,
} from "@/components/Dropdown"
import { Input } from "@/components/Input"
import { cx } from "@/lib/utils"
import {
  RiFlaskLine,
  RiAddLine,
  RiSaveLine,
  RiCloseLine,
  RiEditLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiFileImageLine,
  RiFilePdfLine,
  RiFileWordLine,
  RiFileExcelLine,
  RiDownloadLine,
  RiHeartPulseLine,
  RiQuillPenAiLine,
  RiArrowDownSLine,
  RiMore2Line,
  RiEyeLine,
} from "@remixicon/react"
import type { Attachment, AttachmentKind, LabResult, ScanExtraction } from "@/types/attachment"

interface FilesTabProps {
  labResults: LabResult[]
  attachments: Attachment[]
  scanExtractions?: ScanExtraction[]
  onDeleteAttachment?: (attachmentId: string) => void
  onExtractLab?: (attachmentId: string) => void
  onExtractScan?: (attachmentId: string, text: string) => void
}

function getKind(att: Attachment): AttachmentKind {
  return att.attachment_kind ?? "document"
}

function getKindLabel(att: Attachment): string {
  const k = getKind(att)
  return k === "lab" ? "Lab" : k === "scan" ? "Scan" : "Document"
}

export function FilesTab({
  labResults,
  attachments,
  scanExtractions = [],
  onDeleteAttachment,
  onExtractLab,
  onExtractScan,
}: FilesTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<LabResult>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; fileName: string } | null>(null)
  const [extractConfirm, setExtractConfirm] = useState<{ type: "lab" | "scan" | "document"; attachmentId: string; fileName: string } | null>(null)
  const [simulatedLabResults, setSimulatedLabResults] = useState<Record<string, LabResult[]>>({})
  const [simulatedScanText, setSimulatedScanText] = useState<Record<string, string>>({})
  const [simulatedDocumentText, setSimulatedDocumentText] = useState<Record<string, string>>({})
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set())

  const toggleCardLower = (id: string) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const INITIAL_VISIBLE = 10
  const LOAD_MORE_INCREMENT = 10
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const allFiles = [...attachments].sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
  const visibleFiles = allFiles.slice(0, visibleCount)
  const hasMore = visibleCount < allFiles.length

  const getLabResultsForAttachment = (attachmentId: string) =>
    labResults.filter((r) => r.lab_file_id === attachmentId)

  const getScanExtractionForAttachment = (attachmentId: string): ScanExtraction | undefined =>
    scanExtractions.find((s) => s.attachment_id === attachmentId)

  const getDisplayLabResults = (attachmentId: string): LabResult[] => {
    const fromApi = getLabResultsForAttachment(attachmentId)
    if (fromApi.length > 0) return fromApi
    return simulatedLabResults[attachmentId] ?? []
  }

  const getDisplayScanText = (attachmentId: string): string | undefined => {
    const extraction = getScanExtractionForAttachment(attachmentId)
    if (extraction?.text) return extraction.text
    return simulatedScanText[attachmentId]
  }

  const getDisplayDocumentText = (attachmentId: string): string | undefined =>
    simulatedDocumentText[attachmentId]

  const handleExtractConfirm = () => {
    if (!extractConfirm) return
    const { type, attachmentId } = extractConfirm
    if (type === "lab") {
      const simulated: LabResult[] = [
        { id: `sim-lab-${attachmentId}-1`, patient_id: "", test_name: "Glucose", value: "98", unit: "mg/dL", normal_range: "70-100", status: "normal", test_date: new Date().toISOString().split("T")[0], pdf_url: null, notes: null, lab_file_id: attachmentId },
        { id: `sim-lab-${attachmentId}-2`, patient_id: "", test_name: "HbA1c", value: "5.4", unit: "%", normal_range: "<5.7", status: "normal", test_date: new Date().toISOString().split("T")[0], pdf_url: null, notes: null, lab_file_id: attachmentId },
        { id: `sim-lab-${attachmentId}-3`, patient_id: "", test_name: "Cholesterol", value: "185", unit: "mg/dL", normal_range: "<200", status: "normal", test_date: new Date().toISOString().split("T")[0], pdf_url: null, notes: "AI extracted summary", lab_file_id: attachmentId },
      ]
      setSimulatedLabResults((prev) => ({ ...prev, [attachmentId]: simulated }))
      onExtractLab?.(attachmentId)
    } else if (type === "scan") {
      const simulatedText = "AI extracted summary: No acute findings. Structures are within normal limits. No focal lesion or significant abnormality identified. Impression: Normal study."
      setSimulatedScanText((prev) => ({ ...prev, [attachmentId]: simulatedText }))
      onExtractScan?.(attachmentId, simulatedText)
    } else {
      const simulatedText = "AI extracted summary: Key points and findings from the document. Main topics covered. Summary generated for quick reference."
      setSimulatedDocumentText((prev) => ({ ...prev, [attachmentId]: simulatedText }))
    }
    setExpandedCardIds((prev) => new Set(prev).add(attachmentId))
    setExtractConfirm(null)
  }

  const handleEdit = (result: LabResult) => {
    setEditingId(result.id)
    setEditValues(result)
  }

  const handleSave = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = (id: string) => {
    console.log("Delete:", id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 dark:text-green-400"
      case "abnormal":
        return "text-red-600 dark:text-red-400"
      case "borderline":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <RiFileImageLine className="size-6 text-blue-600 dark:text-blue-400" />
    if (fileType.includes("pdf")) return <RiFilePdfLine className="size-6 text-red-600 dark:text-red-400" />
    if (fileType.includes("word") || fileType.includes("document")) return <RiFileWordLine className="size-6 text-blue-700 dark:text-blue-500" />
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return <RiFileExcelLine className="size-6 text-green-600 dark:text-green-400" />
    return <RiFileTextLine className="size-6 text-gray-600 dark:text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  const hasFiles = allFiles.length > 0

  const renderLabCard = (attachment: Attachment) => {
    const id = attachment.id
    const results = getDisplayLabResults(id)
    const hasExtracted = results.length > 0

    return (
      <div key={id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        {/* Top + expander row: content left, icons column right aligned vertically */}
        <div className="flex gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {attachment.thumbnail_url ? (
                <div className="size-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <img src={attachment.thumbnail_url} alt="" className="size-full object-cover" />
                </div>
              ) : (
                <RiFlaskLine className="size-5 shrink-0 text-primary-600 dark:text-primary-400" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(attachment.file_url, "_blank")}
                    className="max-w-full truncate text-left text-sm font-semibold text-gray-900 hover:text-primary-600 hover:underline dark:text-gray-50 dark:hover:text-primary-400"
                    title="View in new tab"
                  >
                    {attachment.file_name}
                  </button>
                  <Badge variant="neutral" className="shrink-0 text-xs font-medium">{getKindLabel(attachment)}</Badge>
                </div>
                <p className="mt-0.5 text-xs font-medium text-gray-500">{formatDate(attachment.uploaded_at)} · {formatFileSize(attachment.file_size)}</p>
              </div>
            </div>
            {/* Lower part: expander label (toggle via icon in right column) */}
            <div className="border-t border-gray-200 mt-3 pt-3 -mx-1 dark:border-gray-800">
              <button
                type="button"
                onClick={() => toggleCardLower(id)}
                className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
              >
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lab results</span>
              </button>
            </div>
          </div>
          {/* Right column: dropdown and expander icons aligned vertically */}
          <div className="flex shrink-0 flex-col items-center justify-start gap-1 pt-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RiMore2Line className="size-5 text-gray-500" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem onClick={() => setExtractConfirm({ type: "lab", attachmentId: id, fileName: attachment.file_name })}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiQuillPenAiLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Extract with AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(attachment.file_url, "_blank")}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiEyeLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(attachment.file_url, "_blank")}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiDownloadLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteConfirm({ id, fileName: attachment.file_name })} className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiDeleteBinLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => toggleCardLower(id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
              aria-label={expandedCardIds.has(id) ? "Collapse" : "Expand"}
            >
              <RiArrowDownSLine className={cx("size-5 shrink-0 transition-transform dark:text-gray-400", expandedCardIds.has(id) && "rotate-180")} />
            </button>
          </div>
        </div>
        {/* Expanded content: no duplicate expander row */}
        <div className="border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/20">
          {expandedCardIds.has(id) && (
            <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-800">
              {hasExtracted ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Test</th>
                          <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Value</th>
                          <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Status</th>
                          <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {results.map((result) => (
                          <tr key={result.id}>
                            <td className="px-3 py-2.5">
                              {editingId === result.id ? (
                                <Input value={editValues.test_name ?? ""} onChange={(e) => setEditValues({ ...editValues, test_name: e.target.value })} className="h-7 text-xs" />
                              ) : (
                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">{result.test_name}</div>
                              )}
                            </td>
                            <td className="px-3 py-2.5">
                              {editingId === result.id ? (
                                <div className="flex items-center gap-1">
                                  <Input value={editValues.value ?? ""} onChange={(e) => setEditValues({ ...editValues, value: e.target.value })} className="h-7 w-16 text-xs" />
                                  <span className="text-xs text-gray-500">{result.unit}</span>
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {result.value} <span className="ml-0.5 text-[11px] font-normal text-gray-500">{result.unit}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={cx("text-xs font-bold uppercase tracking-wider", getStatusColor(result.status))}>{result.status}</span>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              {editingId === result.id ? (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleSave}><RiSaveLine className="size-4" /></Button>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCancel}><RiCloseLine className="size-4" /></Button>
                                </>
                              ) : (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(result)}><RiEditLine className="size-4 text-gray-400" /></Button>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500/70 hover:text-red-500" onClick={() => handleDelete(result.id)}><RiDeleteBinLine className="size-4" /></Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-7 text-xs font-medium" onClick={() => setExtractConfirm({ type: "lab", attachmentId: id, fileName: attachment.file_name })}>
                      <RiAddLine className="mr-1 size-4" /> Add Test
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center dark:border-gray-800 dark:bg-gray-900/30">
                  <RiQuillPenAiLine className="size-10 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">No lab results extracted yet</p>
                  <p className="mt-1 text-xs text-gray-500">Extract lab results from this file with AI to get started.</p>
                  <Button variant="primary" size="sm" onClick={() => setExtractConfirm({ type: "lab", attachmentId: id, fileName: attachment.file_name })} className="mt-4 gap-1.5">
                    <RiQuillPenAiLine className="size-4" /> Extract with AI
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderScanOrDocCard = (attachment: Attachment) => {
    const id = attachment.id
    const kind = getKind(attachment)
    const isScan = kind === "scan"
    const isDocument = kind === "document"
    const displayScanText = isScan ? getDisplayScanText(id) : undefined
    const displayDocumentText = isDocument ? getDisplayDocumentText(id) : undefined
    const hasExpandableArea = isScan || isDocument

    return (
      <div key={id} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        {/* Content left, icons column right (dropdown + expander aligned vertically) */}
        <div className="flex gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {attachment.thumbnail_url ? (
                <div className="size-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <img src={attachment.thumbnail_url} alt="" className="size-full object-cover" />
                </div>
              ) : isScan ? (
                <RiHeartPulseLine className="size-5 shrink-0 text-primary-600 dark:text-primary-400" />
              ) : (
                <div className="shrink-0">{getFileIcon(attachment.file_type)}</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(attachment.file_url, "_blank")}
                    className="max-w-full truncate text-left text-sm font-semibold text-gray-900 hover:text-primary-600 hover:underline dark:text-gray-50 dark:hover:text-primary-400"
                    title="View in new tab"
                  >
                    {attachment.file_name}
                  </button>
                  <Badge variant="neutral" className="shrink-0 text-xs font-medium">{getKindLabel(attachment)}</Badge>
                </div>
                <p className="mt-0.5 text-xs font-medium text-gray-500">{formatDate(attachment.uploaded_at)} · {formatFileSize(attachment.file_size)}</p>
              </div>
            </div>
            {hasExpandableArea && (
              <div className="border-t border-gray-200 mt-3 pt-3 -mx-1 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => toggleCardLower(id)}
                  className="flex w-full items-center gap-2 rounded-lg px-1 py-2 text-left hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                >
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{isScan ? "AI note" : "AI summary"}</span>
                </button>
              </div>
            )}
          </div>
          {/* Right column: dropdown and expander icons aligned vertically */}
          <div className="flex shrink-0 flex-col items-center justify-start gap-1 pt-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RiMore2Line className="size-5 text-gray-500" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem onClick={() => setExtractConfirm({ type: isScan ? "scan" : "document", attachmentId: id, fileName: attachment.file_name })}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiQuillPenAiLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Extract with AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(attachment.file_url, "_blank")}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiEyeLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(attachment.file_url, "_blank")}>
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiDownloadLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteConfirm({ id, fileName: attachment.file_name })} className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                  <DropdownMenuIconWrapper className="mr-2">
                    <RiDeleteBinLine className="size-4" />
                  </DropdownMenuIconWrapper>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {hasExpandableArea && (
              <button
                type="button"
                onClick={() => toggleCardLower(id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
                aria-label={expandedCardIds.has(id) ? "Collapse" : "Expand"}
              >
                <RiArrowDownSLine className={cx("size-5 shrink-0 transition-transform dark:text-gray-400", expandedCardIds.has(id) && "rotate-180")} />
              </button>
            )}
          </div>
        </div>
        {/* Expanded content for scan and document */}
        {hasExpandableArea && expandedCardIds.has(id) && (
          <div className="border-t border-gray-200 bg-gray-50/50 px-4 pb-4 pt-3 dark:border-gray-800 dark:bg-gray-900/20">
            {isScan ? (
              displayScanText ? (
                <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">AI extracted note</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{displayScanText}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center dark:border-gray-800 dark:bg-gray-900/30">
                  <RiQuillPenAiLine className="size-10 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">No AI note yet</p>
                  <p className="mt-1 text-xs text-gray-500">Extract findings from this scan with AI to get started.</p>
                  <Button variant="primary" size="sm" onClick={() => setExtractConfirm({ type: "scan", attachmentId: id, fileName: attachment.file_name })} className="mt-4 gap-1.5">
                    <RiQuillPenAiLine className="size-4" /> Extract with AI
                  </Button>
                </div>
              )
            ) : (
              displayDocumentText ? (
                <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">AI extracted summary</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{displayDocumentText}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center dark:border-gray-800 dark:bg-gray-900/30">
                  <RiQuillPenAiLine className="size-10 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">No AI summary yet</p>
                  <p className="mt-1 text-xs text-gray-500">Extract a summary from this document with AI to get started.</p>
                  <Button variant="primary" size="sm" onClick={() => setExtractConfirm({ type: "document", attachmentId: id, fileName: attachment.file_name })} className="mt-4 gap-1.5">
                    <RiQuillPenAiLine className="size-4" /> Extract with AI
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    )
  }

  const renderCard = (attachment: Attachment) =>
    getKind(attachment) === "lab" ? renderLabCard(attachment) : renderScanOrDocCard(attachment)

  return (
    <div className="space-y-4">
      {!hasFiles ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 dark:border-gray-800 dark:bg-gray-900/30">
          <RiFlaskLine className="size-10 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">No files yet</p>
          <p className="mt-1 text-xs text-gray-500">Upload lab reports, scans, or documents to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleFiles.map(renderCard)}
          {hasMore && (
            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={() => setVisibleCount((c) => c + LOAD_MORE_INCREMENT)}
                className="w-full text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!extractConfirm}
        onClose={() => setExtractConfirm(null)}
        onConfirm={handleExtractConfirm}
        title="Extract with AI"
        description={extractConfirm ? `Read the file and extract a summary?` : ""}
        confirmText="Extract"
        cancelText="Cancel"
        variant="info"
      />

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            onDeleteAttachment?.(deleteConfirm.id)
            setDeleteConfirm(null)
          }
        }}
        title="Delete file"
        description={deleteConfirm ? `Are you sure you want to delete "${deleteConfirm.fileName}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
