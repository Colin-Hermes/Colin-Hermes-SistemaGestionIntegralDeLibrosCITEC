"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  generateBooksReport,
  generateLoansReport,
  generateStudentsReport,
  generateOverdueReport,
} from "@/lib/pdf-generator"
import { FileText, BookCopy, ClipboardList, Users, AlertTriangle, Download, Loader2 } from "lucide-react"

export default function ReportsPage() {
  const { books, students, loans } = useData()
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  const [loansFilter, setLoansFilter] = useState("all")

  const handleGenerateReport = async (reportType: string) => {
    setLoadingReport(reportType)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    switch (reportType) {
      case "books":
        generateBooksReport(books)
        break
      case "loans":
        generateLoansReport(loans, books, students, loansFilter)
        break
      case "students":
        generateStudentsReport(students, loans)
        break
      case "overdue":
        generateOverdueReport(loans, books, students)
        break
    }

    setLoadingReport(null)
  }

  const reportCards = [
    {
      id: "books",
      title: "Catálogo de Libros",
      description: "Reporte completo del inventario de libros con disponibilidad",
      icon: BookCopy,
      stats: `${books.length} títulos`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "loans",
      title: "Préstamos",
      description: "Historial de préstamos con estados y fechas",
      icon: ClipboardList,
      stats: `${loans.length} registros`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hasFilter: true,
    },
    {
      id: "students",
      title: "Estudiantes",
      description: "Listado de estudiantes registrados con historial de préstamos",
      icon: Users,
      stats: `${students.length} estudiantes`,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      id: "overdue",
      title: "Préstamos Vencidos",
      description: "Reporte urgente de préstamos que requieren atención",
      icon: AlertTriangle,
      stats: `${loans.filter((l) => l.status === "overdue").length} vencidos`,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Reportes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Generador de Reportes PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Genera reportes profesionales en formato PDF listos para imprimir o compartir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCards.map((report) => (
            <Card key={report.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{report.stats}</span>
                </div>
                <CardTitle className="mt-4">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.hasFilter && (
                    <div className="space-y-2">
                      <Label>Filtrar por estado</Label>
                      <Select value={loansFilter} onValueChange={setLoansFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los préstamos</SelectItem>
                          <SelectItem value="active">Solo activos</SelectItem>
                          <SelectItem value="returned">Solo devueltos</SelectItem>
                          <SelectItem value="overdue">Solo vencidos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={loadingReport === report.id}
                  >
                    {loadingReport === report.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Información de Reportes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Formato</p>
                <p className="text-muted-foreground">PDF optimizado para impresión A4</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Contenido</p>
                <p className="text-muted-foreground">Datos actualizados en tiempo real</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Acceso</p>
                <p className="text-muted-foreground">Solo administradores pueden generar reportes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
