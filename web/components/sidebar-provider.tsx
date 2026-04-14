"use client"

import type React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarProvider as OriginalSidebarProvider } from "@/components/ui/sidebar"

interface SidebarProviderProps {
    children: React.ReactNode
    defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
    const isMobile = useIsMobile()

    // On mobile, we want to default to closed
    const effectiveDefaultOpen = isMobile ? false : defaultOpen

    return <OriginalSidebarProvider defaultOpen={effectiveDefaultOpen}>{children}</OriginalSidebarProvider>
}
