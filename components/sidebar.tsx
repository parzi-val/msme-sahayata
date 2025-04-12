"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { MessageSquare, BookOpen, Home } from "lucide-react"
import { IndiaEmblem } from "./india-emblem"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  // Update the navItems array to include Home
  const navItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      title: "Chatbot",
      icon: MessageSquare,
      href: "/chatbot",
      active: pathname === "/chatbot",
    },
    {
      title: "Resources",
      icon: BookOpen,
      href: "/resources",
      active: pathname === "/resources" || pathname.startsWith("/resources/"),
    },
  ]

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <IndiaEmblem className="h-8 w-8 text-primary" />
          <div className="font-semibold">MSME Sahayata</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.active}>
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-4">
          <div className="text-xs text-muted-foreground">
            <p>© 2025 Government of India</p>
            <p>Ministry of Micro, Small & Medium Enterprises</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
