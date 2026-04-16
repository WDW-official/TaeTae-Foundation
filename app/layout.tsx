import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify"
import FloatingDonateButton from "@/components/floating-donate-button"

export const metadata: Metadata = {
  title: "TaeTae Foundation - Building Tomorrow's Leaders",
  description: "TaeTae Foundation mentors and develops boys through Skills, Education, and Sports programs.",
  openGraph: {
    title: "TaeTae Foundation",
    description:
      "Mentoring boys through Skills, Education, and Sports",
    url: "https://www.taetaefoundation.org",
    siteName: "TaeTae Foundation",
    images: [
      {
        url: "/og-image.png", // 👈 your own image
        width: 1200,
        height: 630,
        alt: "TaeTae Foundation",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;700;800&family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800&family=Keania+One&family=Montserrat:wght@400;500;600;700;800;900&family=Signika:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <NextTopLoader
          color="#8bc97f"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen dark:bg-gray-800">
            {children} {/* This will render the page content */}
          </div>
          <FloatingDonateButton />
          <Analytics />
        </ThemeProvider>


        {/* Toast Container for showing toast notifications */}
        <ToastContainer
          position="top-right"  // Set your preferred position
          autoClose={5000}       // Toast will close after 5 seconds
          hideProgressBar={false}  // Show progress bar (optional)
          newestOnTop={false}     // Display newest on top (optional)
          closeOnClick={true}     // Close on click (optional)
          rtl={false}             // Right to left text direction (optional)
        />
      </body>
    </html>
  )
}
