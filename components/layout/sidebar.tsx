"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, FileText, FolderOpen, Newspaper, Users, Calendar, Menu, X } from "lucide-react"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Users", href: "/users", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className={cn("relative bg-white rounded-lg p-1", isCollapsed ? "w-10 h-10" : "w-12 h-12")}>
            <Image
              src="/images/ijg-logo.png"
              alt="IJG Logo"
              width={isCollapsed ? 32 : 40}
              height={isCollapsed ? 32 : 40}
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold">IJG Research</h1>
              <p className="text-xs text-blue-200">Admin Panel</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-blue-700"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-blue-700 hover:text-white",
                    isActive && "bg-blue-600 text-white",
                    isCollapsed && "px-2",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-blue-700">
          <div className="text-xs text-blue-200 text-center">Independent. Focused. Personalised.</div>
        </div>
      )}
    </div>
  )
}
