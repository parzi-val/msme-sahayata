"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IndiaEmblem } from "./india-emblem"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 lg:h-[60px]">
            <SidebarTrigger className="mr-3" />
            <Link href="/" className="flex items-center gap-2">
                <IndiaEmblem className="h-6 w-6 text-primary" />
                <span className="font-medium">MSME Sahayata</span>
            </Link>
            <div className="flex-1" />
        </header>
    )
}
