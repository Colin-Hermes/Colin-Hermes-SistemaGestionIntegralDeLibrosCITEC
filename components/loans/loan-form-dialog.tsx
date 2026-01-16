"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useData } from "@/lib/data-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface LoanFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanFormDialog({ open, onOpenChange }: LoanFormDialogProps) {
  const { books, students, addLoan } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [loanDate, setLoanDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 14))

  const availableBooks = useMemo(() => books.filter((book) => book.available > 0), [books])

  const activeStudents = useMemo(() => students.filter((student) => student.status === "active"), [students])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook || !selectedStudent) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    addLoan({
      bookId: selectedBook,
      studentId: selectedStudent,
      loanDate,
      dueDate,
      status: "active",
      renewals: 0,
    })

    setIsLoading(false)
    setSelectedBook("")
    setSelectedStudent("")
    setLoanDate(new Date())
    setDueDate(addDays(new Date(), 14))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Préstamo</DialogTitle>
          <DialogDescription>Completa los datos para registrar un nuevo préstamo de libro.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Book Selection */}
            <div className="space-y-2">
              <Label htmlFor="book">Libro</Label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar libro" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay libros disponibles
                    </SelectItem>
                  ) : (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        <div className="flex flex-col">
                          <span>{book.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {book.author} • {book.available} disponibles
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student">Estudiante</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {activeStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex flex-col">
                        <span>{student.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {student.studentId} • {student.department}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Préstamo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !loanDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {loanDate ? format(loanDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={loanDate}
                      onSelect={(date) => {
                        if (date) {
                          setLoanDate(date)
                          setDueDate(addDays(date, 14))
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Devolución</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      disabled={(date) => date < loanDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Duration Info */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Duración del préstamo:{" "}
                <span className="font-medium text-foreground">
                  {Math.ceil((dueDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24))} días
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedBook || !selectedStudent}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Préstamo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
