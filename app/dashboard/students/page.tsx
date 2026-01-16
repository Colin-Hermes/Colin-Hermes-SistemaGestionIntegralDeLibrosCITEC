"use client"

import { Suspense, useState, useMemo } from "react"
import { Header } from "@/components/dashboard/header"
import { StudentsTable } from "@/components/students/students-table"
import { StudentFormDialog } from "@/components/students/student-form-dialog"
import { StudentHistoryDialog } from "@/components/students/student-history-dialog"
import { StatsCard } from "@/components/dashboard/stats-card"
import { useData } from "@/lib/data-context"
import type { Student } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Users, UserCheck, UserX, GraduationCap } from "lucide-react"

const departments = [
  "Todos",
  "Ingeniería en Sistemas",
  "Medicina",
  "Derecho",
  "Arquitectura",
  "Administración",
  "Contaduría",
  "Psicología",
]

function StudentsPageContent() {
  const { students } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("Todos")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null)

  // Stats
  const activeStudents = students.filter((s) => s.status === "active").length
  const inactiveStudents = students.filter((s) => s.status === "inactive").length
  const graduatedStudents = students.filter((s) => s.status === "graduated").length

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        student.name.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)

      const matchesStatus = statusFilter === "all" || student.status === statusFilter

      const matchesDepartment = departmentFilter === "Todos" || student.department === departmentFilter

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [students, searchQuery, statusFilter, departmentFilter])

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  const handleCloseForm = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      setEditingStudent(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Registro de Estudiantes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatsCard title="Total Estudiantes" value={students.length} icon={Users} variant="primary" />
          <StatsCard title="Activos" value={activeStudents} icon={UserCheck} variant="success" />
          <StatsCard title="Inactivos" value={inactiveStudents} icon={UserX} variant="warning" />
          <StatsCard title="Graduados" value={graduatedStudents} icon={GraduationCap} variant="default" />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, ID o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="graduated">Graduados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={() => setIsFormOpen(true)} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Estudiante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredStudents.length} de {students.length} estudiantes
          </p>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={filteredStudents}
          onEdit={handleEdit}
          onViewHistory={(student) => setHistoryStudent(student)}
        />
      </div>

      {/* Dialogs */}
      <StudentFormDialog open={isFormOpen} onOpenChange={handleCloseForm} student={editingStudent} />
      <StudentHistoryDialog
        open={!!historyStudent}
        onOpenChange={(open) => !open && setHistoryStudent(null)}
        student={historyStudent}
      />
    </div>
  )
}

export default function StudentsPage() {
  return (
    <Suspense fallback={null}>
      <StudentsPageContent />
    </Suspense>
  )
}
