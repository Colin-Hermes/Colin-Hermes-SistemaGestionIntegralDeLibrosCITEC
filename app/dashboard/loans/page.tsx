"use client"

import { Suspense, useState, useMemo } from "react"
import { Header } from "@/components/dashboard/header"
import { LoansTable } from "@/components/loans/loans-table"
import { LoanFormDialog } from "@/components/loans/loan-form-dialog"
import { StatsCard } from "@/components/dashboard/stats-card"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, ClipboardList, CheckCircle, AlertTriangle, Clock } from "lucide-react"

function LoansPageContent() {
  const { loans, getBookById, getStudentById } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Stats
  const activeLoans = loans.filter((l) => l.status === "active").length
  const returnedLoans = loans.filter((l) => l.status === "returned").length
  const overdueLoans = loans.filter((l) => l.status === "overdue").length

  // Filtered loans
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const book = getBookById(loan.bookId)
      const student = getStudentById(loan.studentId)

      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        book?.title.toLowerCase().includes(searchLower) ||
        student?.name.toLowerCase().includes(searchLower) ||
        student?.studentId.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus = statusFilter === "all" || loan.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [loans, searchQuery, statusFilter, getBookById, getStudentById])

  return (
    <div className="flex flex-col h-full">
      <Header title="Gestión de Préstamos" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard title="Total Préstamos" value={loans.length} icon={ClipboardList} variant="primary" />
          <StatsCard title="Activos" value={activeLoans} icon={Clock} variant="default" />
          <StatsCard title="Devueltos" value={returnedLoans} icon={CheckCircle} variant="success" />
          <StatsCard title="Vencidos" value={overdueLoans} icon={AlertTriangle} variant="destructive" />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por libro, estudiante o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="returned">Devueltos</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Préstamo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredLoans.length} de {loans.length} préstamos
          </p>
        </div>

        {/* Loans Table */}
        <LoansTable loans={filteredLoans} />
      </div>

      <LoanFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

export default function LoansPage() {
  return (
    <Suspense fallback={null}>
      <LoansPageContent />
    </Suspense>
  )
}
