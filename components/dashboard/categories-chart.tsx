"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

const data = [
  { name: "Literatura", value: 245, color: "hsl(220, 70%, 50%)" },
  { name: "Tecnología", value: 180, color: "hsl(160, 60%, 45%)" },
  { name: "Ciencias", value: 156, color: "hsl(280, 60%, 55%)" },
  { name: "Matemáticas", value: 134, color: "hsl(45, 80%, 50%)" },
  { name: "Historia", value: 98, color: "hsl(0, 70%, 55%)" },
]

function CustomTooltip({
  active,
  payload,
}: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) {
  if (!active || !payload || !payload[0]) return null

  const item = payload[0].payload
  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-medium text-sm">{item.name}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{item.value} libros</p>
    </div>
  )
}

export function CategoriesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Libros por Categoría</CardTitle>
        <CardDescription>Distribución del catálogo por área</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
