"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  LayoutDashboard,
  BookCopy,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "staff", "student"] },
  { name: "Libros", href: "/dashboard/books", icon: BookCopy, roles: ["admin", "staff", "student"] },
  { name: "Préstamos", href: "/dashboard/loans", icon: ClipboardList, roles: ["admin", "staff"] },
  { name: "Estudiantes", href: "/dashboard/students", icon: Users, roles: ["admin", "staff"] },
  { name: "Reportes", href: "/dashboard/reports", icon: FileText, roles: ["admin"] },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNav = navigation.filter((item) => hasPermission(item.roles as ("admin" | "staff" | "student")[]))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: "Administrador",
      staff: "Bibliotecario",
      student: "Estudiante",
    }
    return badges[role as keyof typeof badges] || role
  }

  return (
    <aside
      className={cn("h-screen bg-card border-r flex flex-col transition-all duration-300", collapsed ? "w-20" : "w-64")}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">BiblioGestión</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user && getRoleBadge(user.role)}</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={logout} className="shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
