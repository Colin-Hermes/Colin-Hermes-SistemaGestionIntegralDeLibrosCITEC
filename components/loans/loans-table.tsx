"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import type { Loan } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, RotateCcw, CheckCircle, ClipboardList, AlertTriangle, Clock } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

interface LoansTableProps {
  loans: Loan[]
}

export function LoansTable({ loans }: LoansTableProps) {
  const { returnBook, renewLoan, getBookById, getStudentById } = useData()
  const [returnDialog, setReturnDialog] = useState<string | null>(null)
  const [renewDialog, setRenewDialog] = useState<string | null>(null)

  const getStatusBadge = (loan: Loan) => {
    switch (loan.status) {
      case "active":
        const daysUntilDue = differenceInDays(loan.dueDate, new Date())
        if (daysUntilDue <= 3 && daysUntilDue > 0) {
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="mr-1 h-3 w-3" />
              Vence pronto
            </Badge>
          )
        }
        return <Badge variant="secondary">Activo</Badge>
      case "returned":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Devuelto
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Vencido
          </Badge>
        )
      default:
        return <Badge variant="outline">{loan.status}</Badge>
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

  const getDaysInfo = (loan: Loan) => {
    if (loan.status === "returned") {
      return <span className="text-muted-foreground">-</span>
    }

    const days = differenceInDays(loan.dueDate, new Date())
    if (days < 0) {
      return <span className="text-destructive font-medium">{Math.abs(days)} días de retraso</span>
    }
    if (days === 0) {
      return <span className="text-amber-600 font-medium">Vence hoy</span>
    }
    if (days <= 3) {
      return <span className="text-amber-600">{days} días restantes</span>
    }
    return <span className="text-muted-foreground">{days} días restantes</span>
  }

  const handleReturn = () => {
    if (returnDialog) {
      returnBook(returnDialog)
      setReturnDialog(null)
    }
  }

  const handleRenew = () => {
    if (renewDialog) {
      renewLoan(renewDialog)
      setRenewDialog(null)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libro</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead className="hidden md:table-cell">Fecha Préstamo</TableHead>
              <TableHead className="hidden md:table-cell">Fecha Devolución</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden lg:table-cell">Tiempo</TableHead>
              <TableHead className="w-[70px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ClipboardList className="h-8 w-8" />
                    <p>No se encontraron préstamos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => {
                const book = getBookById(loan.bookId)
                const student = getStudentById(loan.studentId)

                return (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{book?.title || "Libro no encontrado"}</p>
                        <p className="text-xs text-muted-foreground">{book?.author}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {student ? getInitials(student.name) : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                          <p className="text-sm font-medium">{student?.name}</p>
                          <p className="text-xs text-muted-foreground">{student?.studentId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(loan.loanDate, "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(loan.dueDate, "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{getDaysInfo(loan)}</TableCell>
                    <TableCell>
                      {loan.status !== "returned" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setReturnDialog(loan.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Registrar Devolución
                            </DropdownMenuItem>
                            {loan.renewals < 2 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setRenewDialog(loan.id)}>
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Renovar (+14 días)
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Return Confirmation Dialog */}
      <AlertDialog open={!!returnDialog} onOpenChange={() => setReturnDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar devolución?</AlertDialogTitle>
            <AlertDialogDescription>
              El libro será marcado como devuelto y estará disponible para nuevos préstamos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturn}>Confirmar Devolución</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Renew Confirmation Dialog */}
      <AlertDialog open={!!renewDialog} onOpenChange={() => setRenewDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Renovar préstamo?</AlertDialogTitle>
            <AlertDialogDescription>
              Se extenderá el plazo de devolución por 14 días adicionales. Máximo 2 renovaciones permitidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenew}>Renovar Préstamo</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
