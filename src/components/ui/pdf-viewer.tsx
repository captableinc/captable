"use client";

import { createReactContext } from "@/react-utils/create-context";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { ReactNode, useCallback, useState } from "react";
import { Document, DocumentProps, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

type LoadCallback = Required<DocumentProps>["onLoadSuccess"];
type PDFDocumentProxy = Parameters<LoadCallback>[0];

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

interface PdfViewerProps {
  file: string | File | null;
  onDocumentLoadSuccess?: (e: PDFDocumentProxy) => Promise<void> | void;
}

export const PdfViewer = ({
  file,
  onDocumentLoadSuccess: _onDocumentLoadSuccess,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const onDocumentLoadSuccess: LoadCallback = async (event) => {
    if (_onDocumentLoadSuccess) {
      await _onDocumentLoadSuccess(event);
    }

    const nextNumPages = event.numPages;

    setNumPages(nextNumPages);
  };

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
  );
};

const providerName = "PdfViewer";

const [Provider, useValue] = createReactContext<{
  containerWidth: number;
  numPages: number;
}>(providerName);
export interface PdfViewerRootProps
  extends Omit<DocumentProps, "onDocumentLoadSuccess" | "children"> {
  onDocumentLoadSuccess?: (e: PDFDocumentProxy) => Promise<void> | void;
  children?: ReactNode;
  rootClassName?: string;
}

export function PdfViewerRoot({
  onDocumentLoadSuccess: _onDocumentLoadSuccess,
  children,
  rootClassName,
  ...rest
}: PdfViewerRootProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const onDocumentLoadSuccess: LoadCallback = async (event) => {
    if (_onDocumentLoadSuccess) {
      await _onDocumentLoadSuccess(event);
    }

    const nextNumPages = event.numPages;

    setNumPages(nextNumPages);
  };

  return (
    <Provider numPages={numPages} containerWidth={containerWidth}>
      <div className={rootClassName} ref={setContainerRef}>
        <Document
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
          {...rest}
        >
          {children}
        </Document>
      </div>
    </Provider>
  );
}

export const usePdfValue = () => useValue(providerName);

export const PdfViewerPage = Page;
