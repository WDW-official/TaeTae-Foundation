"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

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
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="w-full flex flex-col items-center">
      <div className={fullScreen ? "fixed inset-0 bg-black z-50 overflow-auto" : "w-full"}>
      
      {/* Toolbar */}
      <div className="flex justify-between p-3 bg-gray-900 text-white">
        <button onClick={() => setFullScreen(!fullScreen)}>
          {fullScreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* PDF */}
      <div className="flex flex-col items-center">
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={fullScreen ? window.innerWidth : 800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
    </div>
  )
}