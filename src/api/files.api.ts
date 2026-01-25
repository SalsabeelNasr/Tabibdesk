/**
 * Files API - Mock implementation for file uploads
 * Replaceable backend layer for proof/receipt uploads
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface UploadFileParams {
  clinicId: string
  entityType: "payment" | "expense"
  entityId: string
  file: File
}

export interface UploadFileResponse {
  fileId: string
  url: string
}

/**
 * Upload a file (proof or receipt)
 * Mock implementation returns fake URL and ID
 */
export async function uploadFile(params: UploadFileParams): Promise<UploadFileResponse> {
  await delay(300)

  // Mock: Generate fake file ID and URL
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const url = `/uploads/${params.entityType}/${params.entityId}/${fileId}.${params.file.name.split('.').pop()}`

  return {
    fileId,
    url,
  }
}
