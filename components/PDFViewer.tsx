"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export default function PDFViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0)
  const [width, setWidth] = useState(0)
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
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="mb-6 shadow-lg bg-white">
              <Page
                pageNumber={i + 1}
                width={width}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div>Loading page...</div>}
            />  
            </div>
        ))}
      </Document>
    </div>
  )
}