"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, CheckCheck, BookOpen, RotateCcw, AlertTriangle, Clock, Settings } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function NotificationsPanel() {
  const { notifications, markAsRead, markAllAsRead } = useData()
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Simulate real-time notifications with a visual pulse
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    if (unreadCount > 0) {
      setHasNew(true)
      const timer = setTimeout(() => setHasNew(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "loan":
        return <BookOpen className="h-4 w-4 text-primary" />
      case "return":
        return <RotateCcw className="h-4 w-4 text-emerald-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "reminder":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "system":
        return <Settings className="h-4 w-4 text-muted-foreground" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return "bg-card"
    switch (type) {
      case "overdue":
        return "bg-destructive/5"
      case "reminder":
        return "bg-amber-50"
      case "loan":
        return "bg-primary/5"
      case "return":
        return "bg-emerald-50"
      default:
        return "bg-muted/50"
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", hasNew && "animate-bounce")} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs",
                hasNew && "animate-pulse",
              )}
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificaciones</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Marcar todas
              </Button>
            )}
          </div>
          <SheetDescription>
            {unreadCount > 0 ? `Tienes ${unreadCount} notificaciones sin leer` : "Todas las notificaciones leídas"}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-150px)] mt-4 -mx-6 px-6">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
                    getNotificationBg(notification.type, notification.read),
                    !notification.read && "border-primary/20",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium", !notification.read && "text-foreground")}>
                          {notification.title}
                        </p>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(notification.createdAt, "PPp", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
