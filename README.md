# **📚 Sistema de Gestión Integral de Libros - Facultad CITEC**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## **📋 Descripción del Proyecto**

Sistema web integral para la gestión y automatización de los procesos del almacén de libros de la Facultad de Ciencias y Tecnologías Computacionales (CITEC) de la Universidad de las Ciencias Informáticas (UCI). El sistema moderniza los procesos manuales actuales, ofreciendo una plataforma escalable, segura y eficiente para la gestión bibliográfica.

### **🎯 Objetivo Principal**
Optimizar los procesos de gestión de libros mediante la automatización del control de inventario, préstamos, devoluciones y generación de reportes analíticos en tiempo real.

---

## **✨ Características Principales**

### **🔐 Autenticación y Autorización**
- Sistema de login con JWT (JSON Web Tokens)
- Tres roles diferenciados: Administrador, Personal de Almacén, Estudiante
- Dashboard personalizado según rol
- Recuperación de contraseña segura

### **📊 Dashboard Intuitivo**
- Estadísticas en tiempo real (libros, préstamos, usuarios)
- Gráficos interactivos de tendencias
- Notificaciones de préstamos próximos a vencer
- Accesos rápidos a módulos principales

### **📚 Gestión de Catálogo de Libros**
- CRUD completo de libros con múltiples campos
- Buscador avanzado con filtros por categoría, autor, estado
- Control de inventario en tiempo real
- Categorización por asignaturas del plan de estudio
- Gestión de ubicación física (estantes, secciones)

### **🔄 Sistema de Préstamos Inteligente**
- Registro rápido de préstamos con validación de disponibilidad
- Cálculo automático de fechas de devolución
- Sistema de renovaciones y reservas
- Control de morosidad con bloqueos automáticos
- Comprobantes de préstamo generados automáticamente

### **👥 Gestión de Usuarios**
- Registro de estudiantes por carné universitario
- Historial completo de préstamos por usuario
- Perfiles académicos vinculados a carreras
- Sistema de sanciones y bloqueos por morosidad

### **📈 Reportes Analíticos**
- Reporte de inventario detallado
- Estadísticas de préstamos por período
- Listado de libros más solicitados
- Reporte de morosidad por carrera/estudiante
- Exportación a formatos PDF, Excel y CSV

### **🔔 Sistema de Notificaciones**
- Recordatorios automáticos por correo electrónico
- Notificaciones en sistema para eventos importantes
- Alertas de libros con bajo stock
- Recordatorios de devolución (3 días antes)

---

## **🛠️ Tecnologías Utilizadas**

### **Frontend**
- **React v19.0.0** - Biblioteca para interfaces de usuario
- **TypeScript v5.7.3** - Tipado estático para JavaScript
- **Tailwind CSS v3.4** - Framework CSS utility-first
- **React Router v6** - Enrutamiento de aplicación SPA
- **Chart.js v4.4** - Gráficos interactivos
- **Formik + Yup** - Manejo y validación de formularios
- **Axios** - Cliente HTTP para APIs

### **Backend**
- **Node.js v22.13.0 (LTS)** - Entorno de ejecución JavaScript
- **Express.js v4.18** - Framework para aplicaciones web
- **PostgreSQL v17.2** - Sistema de base de datos relacional
- **Prisma ORM v5** - ORM para TypeScript y Node.js
- **JSON Web Token v9.0.2** - Autenticación stateless
- **Bcrypt.js** - Encriptación de contraseñas
- **Nodemailer** - Envío de correos electrónicos

### **Herramientas de Desarrollo**
- **Git v2.48.0** - Control de versiones
- **GitHub** - Plataforma de colaboración
- **Docker** - Contenedores para despliegue
- **Postman** - Pruebas de API
- **ESLint + Prettier** - Linting y formateo de código
- **Jest + Supertest** - Testing del backend

---

## **🚀 Instalación y Configuración**

### **Prerrequisitos**
- Node.js v22.13.0 o superior
- PostgreSQL v17.2 o superior
- Git v2.48.0 o superior
- npm v10 o yarn v1.22

### **Pasos de Instalación**

```bash
# 1. Clonar el repositorio
git clone https://github.com/colinhermes/sistema-gestion-libros-citec.git
cd sistema-gestion-libros-citec

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Configurar base de datos
npm run db:setup
npm run db:seed

# 5. Instalar dependencias del frontend
cd ../frontend
npm install

# 6. Iniciar servidores
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### **Configuración de Variables de Entorno**

```env
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/citec_libros"
JWT_SECRET="tu_clave_secreta_jwt"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASS="tu_contraseña_app"

# Frontend (.env)
REACT_APP_API_URL="http://localhost:5000/api"
REACT_APP_ENV="development"
```

---

## **🏗️ Estructura del Proyecto**

```
sistema-gestion-libros-citec/
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Definición de rutas API
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── utils/           # Utilidades y helpers
│   │   ├── config/          # Configuraciones
│   │   └── server.ts        # Punto de entrada
│   ├── prisma/             # Esquemas Prisma y migraciones
│   ├── tests/              # Pruebas unitarias y de integración
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # Contextos de React
│   │   ├── services/       # Servicios API
│   │   ├── utils/          # Utilidades
│   │   ├── assets/         # Imágenes, estilos, fuentes
│   │   ├── types/          # Definiciones TypeScript
│   │   └── App.tsx         # Componente principal
│   └── package.json
│
├── docs/                   # Documentación del proyecto
├── docker/                 # Configuraciones Docker
├── scripts/               # Scripts de utilidad
└── README.md              # Este archivo
```

---

## **🔧 Comandos Útiles**

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run test             # Ejecutar pruebas
npm run lint             # Linting del código

# Base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Poblar base de datos con datos inicial
npm run db:studio        # Abrir Prisma Studio

# Docker
docker-compose up        # Levantar contenedores
docker-compose down      # Detener contenedores

# Producción
npm start                # Iniciar en producción
npm run pm2:start       # Iniciar con PM2
```

---

## **📖 Guía de Uso**

### **Roles y Permisos**

| Rol | Permisos |
|-----|----------|
| **Administrador** | Todas las funcionalidades, gestión de usuarios, configuración del sistema |
| **Personal de Almacén** | Gestión de préstamos, devoluciones, consulta de inventario, reportes básicos |
| **Estudiante** | Consulta de catálogo, historial personal de préstamos, renovación de libros |

### **Flujos de Trabajo Principales**

1. **Registro de Préstamo:**
   - Buscar estudiante por carné
   - Seleccionar libro(s) disponibles
   - Confirmar fecha de devolución
   - Generar comprobante

2. **Devolución de Libro:**
   - Escanear código de préstamo
   - Verificar estado del libro
   - Aplicar multas si corresponde
   - Actualizar inventario

3. **Gestión de Inventario:**
   - Agregar nuevos libros
   - Actualizar cantidades disponibles
   - Gestionar bajas por deterioro/pérdida
   - Generar reportes de stock

---

## **🧪 Pruebas y Calidad**

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas de integración
npm run test:integration

# Pruebas de cobertura
npm run test:coverage

# Pruebas de carga (con Artillery)
npm run test:load

# Pruebas de seguridad (con OWASP ZAP)
npm run test:security
```

**Cobertura de pruebas objetivo:** > 80%

---

## **🚢 Despliegue**

### **Requisitos para Producción**
- Servidor Linux (Ubuntu 22.04 LTS recomendado)
- PostgreSQL 17.2 en servidor dedicado
- Node.js 22.13 LTS
- Nginx como reverse proxy
- Certificado SSL (Let's Encrypt)

### **Despliegue con Docker**

```bash
# Construir imágenes
docker-compose build

# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### **Archivo docker-compose.yml de ejemplo:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:17.2
    environment:
      POSTGRES_DB: citec_libros
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: strong_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://admin:strong_password@postgres:5432/citec_libros

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## **📈 Métricas y Monitoreo**

- **Uptime:** 99.9% objetivo
- **Tiempo de respuesta API:** < 200ms
- **Usuarios concurrentes:** Hasta 500 simultáneos
- **Almacenamiento estimado:** 10GB inicial, escalable

**Herramientas de monitoreo:**
- Prometheus + Grafana para métricas
- Sentry para tracking de errores
- LogRocket para sesiones de usuario

---

## **🔒 Seguridad**

### **Medidas Implementadas:**
- ✅ Autenticación con JWT y refresh tokens
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Rate limiting para prevención de ataques
- ✅ CORS configurado específicamente
- ✅ Sanitización de inputs contra XSS
- ✅ Protección contra SQL Injection (ORM)
- ✅ Headers de seguridad HTTP (Helmet)
- ✅ Auditoría de logs de acceso

### **Requisitos de Contraseña:**
- Mínimo 8 caracteres
- Al menos una mayúscula, minúscula, número y carácter especial
- No reutilización de últimas 5 contraseñas
- Bloqueo tras 5 intentos fallidos

---

## **📄 Licencia**

Este proyecto es desarrollado como trabajo de diploma en la Universidad de las Ciencias Informáticas (UCI) y se distribuye bajo los términos de la licencia académica institucional.

**Propiedad intelectual:** Universidad de las Ciencias Informáticas (UCI)

---



---

## **🎓 Contexto Académico**

Este proyecto forma parte del trabajo de diploma para optar por el título de **Ingeniero en Ciencias Informáticas** en la Universidad de las Ciencias Informáticas, bajo el lema "Universidad de la Producción".

**Año de desarrollo:** 2025-2026
**Facultad:** Ciencias y Tecnologías Computacionales (CITEC)
**Institución:** Universidad de las Ciencias Informáticas (UCI)

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**

---

*Última actualización: Enero 2026 | Versión: 1.0.0*
