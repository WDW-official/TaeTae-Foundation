import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TaeTae Foundation - Building Tomorrow's Leaders",
  description: "TaeTae Foundation mentors and develops boys through Skills, Education, and Sports programs.",

  icons: {
    icon: [
      "/public/favicon.ico",
    ],
    apple: ["/public/apple-touch-icon.png"],
    shortcut: ["/public/favicon.ico"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
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
