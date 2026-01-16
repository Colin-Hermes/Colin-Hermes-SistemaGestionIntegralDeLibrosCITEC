"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, Clock, Database, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Configuración" />

      <div className="flex-1 p-6 space-y-6 max-w-4xl">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura cómo y cuándo recibir alertas del sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones de préstamos vencidos</Label>
                <p className="text-sm text-muted-foreground">Recibir alertas cuando un préstamo se vence</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de devolución</Label>
                <p className="text-sm text-muted-foreground">Notificar 3 días antes de la fecha límite</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones de nuevos préstamos</Label>
                <p className="text-sm text-muted-foreground">Alertar cuando se registra un nuevo préstamo</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Correo Electrónico</CardTitle>
                <CardDescription>Configuración de envío de correos automáticos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Servidor SMTP</Label>
                <Input placeholder="smtp.ejemplo.com" defaultValue="smtp.biblioteca.edu" />
              </div>
              <div className="space-y-2">
                <Label>Puerto</Label>
                <Input placeholder="587" defaultValue="587" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Correo de envío</Label>
              <Input placeholder="noreply@biblioteca.edu" defaultValue="biblioteca@universidad.edu" />
            </div>
          </CardContent>
        </Card>

        {/* Loan Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle>Préstamos</CardTitle>
                <CardDescription>Reglas y políticas de préstamos de libros</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duración estándar (días)</Label>
                <Input type="number" defaultValue="14" />
              </div>
              <div className="space-y-2">
                <Label>Máximo de renovaciones</Label>
                <Input type="number" defaultValue="2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Libros máximos por estudiante</Label>
                <Input type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label>Días de gracia</Label>
                <Input type="number" defaultValue="3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Database className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle>Sistema</CardTitle>
                <CardDescription>Información del sistema y base de datos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Versión</p>
                <p className="font-medium">BiblioGestión v1.0.0</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Base de datos</p>
                <p className="font-medium">PostgreSQL 15</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Última sincronización</p>
                <p className="font-medium">Hace 2 minutos</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Estado</p>
                <p className="font-medium text-emerald-600">Operativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  )
}
