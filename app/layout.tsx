import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"

import { AppSidebar } from "@/components/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { SiteHeader } from "@/components/site-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MSME Sahayata - Government of India",
  description: "Find MSME grants and subsidies you're eligible for",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get the sidebar state from cookies for desktop
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar:state")
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true

  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}
