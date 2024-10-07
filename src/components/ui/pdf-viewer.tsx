"use client";

import { invariant } from "@/lib/error";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import {
  Fragment,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Document, type DocumentProps, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

type LoadCallback = Required<DocumentProps>["onLoadSuccess"];
type PDFDocumentProxy = Parameters<LoadCallback>[0];

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

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
        {Array.from(new Array(numPages), (_, pageNumber) => (
          <Fragment key={`page_${pageNumber + 1}`}>
            <Page
              pageNumber={pageNumber + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={containerWidth}
            />
            <hr />
          </Fragment>
        ))}
      </Document>
    </div>
  );
};

const PdfProviderContext = createContext<{
  containerWidth: number;
  numPages: number;
} | null>(null);

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
    <div className={rootClassName} ref={setContainerRef}>
      <PdfProviderContext.Provider value={{ numPages, containerWidth }}>
        <Document
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
          {...rest}
        >
          {children}
        </Document>
      </PdfProviderContext.Provider>
    </div>
  );
}

export const usePdfValue = () => {
  const data = useContext(PdfProviderContext);

  invariant(data, "usePdfValue must be used within PdfViewerRoot");

  return data;
};

export const PdfViewerPage = Page;
