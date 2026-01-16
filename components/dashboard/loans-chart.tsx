"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { month: "Ene", prestamos: 45, devoluciones: 42 },
  { month: "Feb", prestamos: 52, devoluciones: 48 },
  { month: "Mar", prestamos: 61, devoluciones: 55 },
  { month: "Abr", prestamos: 48, devoluciones: 51 },
  { month: "May", prestamos: 55, devoluciones: 49 },
  { month: "Jun", prestamos: 67, devoluciones: 62 },
  { month: "Jul", prestamos: 38, devoluciones: 40 },
  { month: "Ago", prestamos: 72, devoluciones: 65 },
  { month: "Sep", prestamos: 85, devoluciones: 78 },
  { month: "Oct", prestamos: 78, devoluciones: 72 },
  { month: "Nov", prestamos: 65, devoluciones: 68 },
  { month: "Dic", prestamos: 58, devoluciones: 55 },
]

function CustomTooltip({
  active,
  payload,
  label,
}: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="font-medium text-sm mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.dataKey === "prestamos" ? "hsl(220, 70%, 50%)" : "hsl(160, 60%, 45%)" }}
          />
          <span className="text-muted-foreground">
            {entry.dataKey === "prestamos" ? "Préstamos" : "Devoluciones"}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LoansChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Actividad de Préstamos</CardTitle>
        <CardDescription>Préstamos y devoluciones mensuales durante el año</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="prestamos" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="devoluciones" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(220, 70%, 50%)" }} />
            <span className="text-sm text-muted-foreground">Préstamos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(160, 60%, 45%)" }} />
            <span className="text-sm text-muted-foreground">Devoluciones</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
