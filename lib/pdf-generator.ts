import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Book, Student, Loan } from "./types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function generateBooksReport(books: Book[]): void {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(30, 64, 175) // Primary blue
  doc.text("Reporte de Catálogo de Libros", 14, 22)

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${format(new Date(), "PPP", { locale: es })}`, 14, 30)

  // Summary
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  const totalCopies = books.reduce((acc, b) => acc + b.copies, 0)
  const availableCopies = books.reduce((acc, b) => acc + b.available, 0)
  doc.text(`Total de títulos: ${books.length}`, 14, 40)
  doc.text(`Total de copias: ${totalCopies}`, 14, 47)
  doc.text(`Copias disponibles: ${availableCopies}`, 14, 54)

  // Table
  autoTable(doc, {
    startY: 65,
    head: [["Título", "Autor", "Categoría", "ISBN", "Copias", "Disponibles"]],
    body: books.map((book) => [book.title, book.author, book.category, book.isbn, book.copies, book.available]),
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255],
    },
    styles: {
      fontSize: 9,
    },
  })

  doc.save(`catalogo-libros-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function generateLoansReport(loans: Loan[], books: Book[], students: Student[], filterStatus?: string): void {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(30, 64, 175)
  doc.text("Reporte de Préstamos", 14, 22)

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${format(new Date(), "PPP", { locale: es })}`, 14, 30)

  // Summary
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  const active = loans.filter((l) => l.status === "active").length
  const returned = loans.filter((l) => l.status === "returned").length
  const overdue = loans.filter((l) => l.status === "overdue").length

  doc.text(`Total de préstamos: ${loans.length}`, 14, 40)
  doc.text(`Activos: ${active} | Devueltos: ${returned} | Vencidos: ${overdue}`, 14, 47)

  // Filter loans if status specified
  const filteredLoans = filterStatus && filterStatus !== "all" ? loans.filter((l) => l.status === filterStatus) : loans

  // Table
  autoTable(doc, {
    startY: 58,
    head: [["Libro", "Estudiante", "Fecha Préstamo", "Fecha Devolución", "Estado"]],
    body: filteredLoans.map((loan) => {
      const book = books.find((b) => b.id === loan.bookId)
      const student = students.find((s) => s.id === loan.studentId)
      const statusText = loan.status === "active" ? "Activo" : loan.status === "returned" ? "Devuelto" : "Vencido"
      return [
        book?.title || "N/A",
        student?.name || "N/A",
        format(loan.loanDate, "dd/MM/yyyy"),
        loan.returnDate ? format(loan.returnDate, "dd/MM/yyyy") : format(loan.dueDate, "dd/MM/yyyy"),
        statusText,
      ]
    }),
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255],
    },
    styles: {
      fontSize: 9,
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === "body") {
        const status = data.cell.raw as string
        if (status === "Vencido") {
          data.cell.styles.textColor = [220, 38, 38]
          data.cell.styles.fontStyle = "bold"
        } else if (status === "Activo") {
          data.cell.styles.textColor = [30, 64, 175]
        } else {
          data.cell.styles.textColor = [22, 163, 74]
        }
      }
    },
  })

  doc.save(`reporte-prestamos-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function generateStudentsReport(students: Student[], loans: Loan[]): void {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(30, 64, 175)
  doc.text("Reporte de Estudiantes", 14, 22)

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${format(new Date(), "PPP", { locale: es })}`, 14, 30)

  // Summary
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  const active = students.filter((s) => s.status === "active").length
  const graduated = students.filter((s) => s.status === "graduated").length

  doc.text(`Total de estudiantes: ${students.length}`, 14, 40)
  doc.text(`Activos: ${active} | Graduados: ${graduated}`, 14, 47)

  // Table
  autoTable(doc, {
    startY: 58,
    head: [["ID", "Nombre", "Departamento", "Email", "Estado", "Préstamos"]],
    body: students.map((student) => {
      const studentLoans = loans.filter((l) => l.studentId === student.id)
      const activeLoans = studentLoans.filter((l) => l.status === "active").length
      const statusText =
        student.status === "active" ? "Activo" : student.status === "graduated" ? "Graduado" : "Inactivo"
      return [
        student.studentId,
        student.name,
        student.department,
        student.email,
        statusText,
        `${activeLoans}/${studentLoans.length}`,
      ]
    }),
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255],
    },
    styles: {
      fontSize: 8,
    },
  })

  doc.save(`reporte-estudiantes-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function generateOverdueReport(loans: Loan[], books: Book[], students: Student[]): void {
  const doc = new jsPDF()
  const overdueLoans = loans.filter((l) => l.status === "overdue")

  // Title
  doc.setFontSize(20)
  doc.setTextColor(220, 38, 38) // Red for overdue
  doc.text("Reporte de Préstamos Vencidos", 14, 22)

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${format(new Date(), "PPP", { locale: es })}`, 14, 30)

  // Alert
  doc.setFontSize(12)
  doc.setTextColor(220, 38, 38)
  doc.text(`⚠ ${overdueLoans.length} préstamos requieren atención inmediata`, 14, 40)

  if (overdueLoans.length === 0) {
    doc.setTextColor(22, 163, 74)
    doc.text("No hay préstamos vencidos. ¡Excelente!", 14, 55)
  } else {
    // Table
    autoTable(doc, {
      startY: 50,
      head: [["Libro", "Estudiante", "Email", "Teléfono", "Días Vencido", "Fecha Límite"]],
      body: overdueLoans.map((loan) => {
        const book = books.find((b) => b.id === loan.bookId)
        const student = students.find((s) => s.id === loan.studentId)
        const daysOverdue = Math.floor((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        return [
          book?.title || "N/A",
          student?.name || "N/A",
          student?.email || "N/A",
          student?.phone || "N/A",
          `${daysOverdue} días`,
          format(loan.dueDate, "dd/MM/yyyy"),
        ]
      }),
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [254, 242, 242],
      },
      styles: {
        fontSize: 8,
      },
    })
  }

  doc.save(`prestamos-vencidos-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
