"use client"

import type React from "react"

import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import "../styles/globals.css"
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}





