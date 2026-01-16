"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getEnrichedLoans } from "@/lib/mock-data"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function RecentLoans() {
  const loans = getEnrichedLoans().slice(0, 5)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary">Activo</Badge>
      case "returned":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Devuelto
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préstamos Recientes</CardTitle>
        <CardDescription>Últimas transacciones registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {loan.student ? getInitials(loan.student.name) : "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{loan.book?.title}</p>
                <p className="text-xs text-muted-foreground truncate">{loan.student?.name}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(loan.status)}
                <p className="text-xs text-muted-foreground mt-1">{format(loan.loanDate, "dd MMM", { locale: es })}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
