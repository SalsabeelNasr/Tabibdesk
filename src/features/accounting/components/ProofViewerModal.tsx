"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog"
import { Button } from "@/components/Button"
import { RiDownloadLine, RiCloseLine } from "@remixicon/react"
import Image from "next/image"

interface ProofViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileId?: string
  title?: string
}

// Map file IDs to local images (for now)
const getProofImageUrl = (fileId?: string): string => {
  if (!fileId) return "/mock/receipt-sample.svg"
  
  // Map different file IDs to different sample images
  // For now, all use the same sample receipt image
  // You can add more images to /public/mock/ and map them here
  const imageMap: Record<string, string> = {
    "proof_001": "/mock/receipt-sample.svg",
    "proof_002": "/mock/receipt-sample.svg",
    "receipt_001": "/mock/receipt-sample.svg",
    "receipt_004": "/mock/receipt-sample.svg",
  }
  
  return imageMap[fileId] || "/mock/receipt-sample.svg"
}

export function ProofViewerModal({
  open,
  onOpenChange,
  fileId,
  title = "Proof of Payment",
}: ProofViewerModalProps) {
  const imageUrl = getProofImageUrl(fileId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] relative">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 z-10 aspect-square p-1 hover:bg-gray-100 hover:dark:bg-gray-400/10"
          >
            <RiCloseLine className="size-6" aria-hidden="true" />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            View and download the proof of payment document
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 overflow-auto max-h-[60vh] flex items-center justify-center">
          {imageUrl.endsWith('.svg') ? (
            <img
              src={imageUrl}
              alt="Proof of payment"
              className="object-contain max-w-full max-h-[60vh] mx-auto"
            />
          ) : (
            <Image
              src={imageUrl}
              alt="Proof of payment"
              width={800}
              height={1000}
              className="object-contain max-w-full max-h-[60vh]"
              unoptimized
            />
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={() => {
              // Download functionality
              const link = document.createElement("a")
              link.href = imageUrl
              link.download = `proof-${fileId || "payment"}.${imageUrl.endsWith('.svg') ? 'svg' : 'jpg'}`
              link.click()
            }}
          >
            <RiDownloadLine className="mr-2 size-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
