import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { WhatsAppPopup } from "@/components/ui/whatsapp-popup"
import "./globals.css"
import "tw-animate-css/dist/tw-animate.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Wanderpals | Travel Slower. Stay Longer.",
  description: "A travel and stay experience designed like cinema. For travellers who value people over plans.",
  keywords: ["travel", "hostels", "trips", "India", "backpacking", "slow travel"],
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0B0E11",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <WhatsAppPopup />
      </body>
    </html>
  )
}
