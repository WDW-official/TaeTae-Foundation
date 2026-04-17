"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2, Maximize2, Minimize2 } from "lucide-react"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export default function PDFViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0)
  const [width, setWidth] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    window.addEventListener("resize", updateWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateWidth)
    }
  }, [fullScreen])

  const pageWidth = Math.max(
    240,
    Math.min((width || 0) - (fullScreen ? 32 : 24), fullScreen ? 1200 : 920)
  )

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex w-full gap-2 flex-col items-center"
    >
      <div
        ref={containerRef}
        className={
          fullScreen
            ? "fixed inset-0 z-50 overflow-auto bg-black/90 px-3 py-4 md:px-6"
            : "w-full"
        }
      >
        {/* <div className="sticky top-0 z-10 flex justify-end bg-transparent pb-3">
          <button
            type="button"
            onClick={() => setFullScreen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-gray-900/90 text-white shadow-lg backdrop-blur transition hover:bg-gray-800"
            aria-label={fullScreen ? "Exit fullscreen" : "Open fullscreen"}
          >
            {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div> */}

        <div className="flex flex-col items-center gap-5 pb-4 md:gap-7">
          <Document
            file={src}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex min-h-[320px] w-full items-center justify-center rounded-2xl bg-muted/40 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading plan...
                </span>
              </div>
            }
            error={
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                We couldn&apos;t load the plan PDF right now.
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                className="overflow-hidden mb-2 border border-gray-50 rounded-xl"
              >
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading=""
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}
