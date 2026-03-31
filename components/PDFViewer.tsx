"use client"

type PDFViewerProps = {
  src: string
}

export default function PDFViewer({ src }: PDFViewerProps) {
  return (
    <div className="w-full h-full">
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-full border-0"
      />
    </div>
  )
}
