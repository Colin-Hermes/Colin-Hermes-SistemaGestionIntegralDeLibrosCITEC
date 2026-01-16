"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { LoansChart } from "@/components/dashboard/loans-chart"
import { CategoriesChart } from "@/components/dashboard/categories-chart"
import { RecentLoans } from "@/components/dashboard/recent-loans"
import { BookOpen, Users, ClipboardList, AlertTriangle, TrendingUp, BookMarked } from "lucide-react"
import { mockBooks, mockStudents, mockLoans } from "@/lib/mock-data"

export default function DashboardPage() {
  // Calculate stats from mock data
  const totalBooks = mockBooks.reduce((acc, book) => acc + book.copies, 0)
  const availableBooks = mockBooks.reduce((acc, book) => acc + book.available, 0)
  const activeStudents = mockStudents.filter((s) => s.status === "active").length
  const activeLoans = mockLoans.filter((l) => l.status === "active").length
  const overdueLoans = mockLoans.filter((l) => l.status === "overdue").length

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Libros"
            value={totalBooks}
            description={`${availableBooks} disponibles`}
            icon={BookOpen}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Estudiantes Activos"
            value={activeStudents}
            description="Usuarios registrados"
            icon={Users}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Préstamos Activos"
            value={activeLoans}
            description="En circulación"
            icon={ClipboardList}
            variant="default"
          />
          <StatsCard
            title="Préstamos Vencidos"
            value={overdueLoans}
            description="Requieren atención"
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoansChart />
          <CategoriesChart />
        </div>

        {/* Additional Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard
              title="Préstamos este Mes"
              value={58}
              description="vs 52 el mes pasado"
              icon={TrendingUp}
              variant="primary"
              trend={{ value: 11.5, isPositive: true }}
            />
            <StatsCard
              title="Libros más Prestados"
              value='"Clean Code"'
              description="15 préstamos este mes"
              icon={BookMarked}
              variant="success"
            />
          </div>
          <RecentLoans />
        </div>
      </div>
    </div>
  )
}
