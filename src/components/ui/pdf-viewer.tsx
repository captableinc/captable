'use client'

import { useResizeObserver } from '@wojtekmaj/react-hooks'
import { useCallback, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
}

const resizeObserverOptions = {}

interface PdfViewerProps {
  file: string | File | null
  onDocumentLoadSuccess?: (e: PDFDocumentProxy) => Promise<void> | void
}

export const PdfViewer = ({
  file,
  onDocumentLoadSuccess: _onDocumentLoadSuccess,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>()
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries

    if (entry) {
      setContainerWidth(entry.contentRect.width)
    }
  }, [])

  useResizeObserver(containerRef, resizeObserverOptions, onResize)

  const onDocumentLoadSuccess = async (event: PDFDocumentProxy) => {
    if (_onDocumentLoadSuccess) {
      await _onDocumentLoadSuccess(event)
    }

    const nextNumPages = event.numPages

    setNumPages(nextNumPages)
  }

  return (
    <div className="overflow-hidden" ref={setContainerRef}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        className="w-full overflow-hidden rounded"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={containerWidth}
          />
        ))}
      </Document>
    </div>
  )
}
