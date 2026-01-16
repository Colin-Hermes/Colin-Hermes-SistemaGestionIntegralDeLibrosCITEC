"use client"

import { useData } from "@/lib/data-context"
import type { Student } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookCopy, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface StudentHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
}

export function StudentHistoryDialog({ open, onOpenChange, student }: StudentHistoryDialogProps) {
  const { getStudentLoans, getBookById } = useData()

  if (!student) return null

  const loans = getStudentLoans(student.id)
  const activeLoans = loans.filter((l) => l.status === "active").length
  const returnedLoans = loans.filter((l) => l.status === "returned").length
  const overdueLoans = loans.filter((l) => l.status === "overdue").length

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-primary" />
      case "returned":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historial del Estudiante</DialogTitle>
          <DialogDescription>Registro completo de préstamos y actividad</DialogDescription>
        </DialogHeader>

        {/* Student Info */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <p className="text-sm text-muted-foreground">{student.studentId}</p>
            <p className="text-sm text-muted-foreground">{student.department}</p>
          </div>
          <div className="text-right">
            <Badge variant={student.status === "active" ? "default" : "secondary"}>
              {student.status === "active" ? "Activo" : student.status === "graduated" ? "Graduado" : "Inactivo"}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-primary/5 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{activeLoans}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-600">{returnedLoans}</p>
            <p className="text-xs text-muted-foreground">Devueltos</p>
          </div>
          <div className="p-3 bg-destructive/5 rounded-lg text-center">
            <p className="text-2xl font-bold text-destructive">{overdueLoans}</p>
            <p className="text-xs text-muted-foreground">Vencidos</p>
          </div>
        </div>

        {/* Loan History */}
        <div>
          <h4 className="font-medium mb-3">Historial de Préstamos</h4>
          <ScrollArea className="h-[250px] pr-4">
            {loans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BookCopy className="h-8 w-8 mb-2" />
                <p>No hay préstamos registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan) => {
                  const book = getBookById(loan.bookId)
                  return (
                    <div key={loan.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-1">{getStatusIcon(loan.status)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{book?.title || "Libro no encontrado"}</p>
                        <p className="text-xs text-muted-foreground">{book?.author}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(loan.loanDate, "dd MMM yyyy", { locale: es })}</span>
                          <span>-</span>
                          <span>
                            {loan.returnDate
                              ? format(loan.returnDate, "dd MMM yyyy", { locale: es })
                              : format(loan.dueDate, "dd MMM yyyy", { locale: es })}
                          </span>
                        </div>
                      </div>
                      <div>{getStatusBadge(loan.status)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
