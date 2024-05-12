'use client'

import { PdfViewer } from '@/components/ui/pdf-viewer'

type DocumentSharePdfViewerProps = {
  url: string
}

export const DocumentSharePdfViewer = ({
  url,
}: DocumentSharePdfViewerProps) => {
  return (
    <PdfViewer onDocumentLoadSuccess={() => console.log('heer')} file={url} />
  )
}
