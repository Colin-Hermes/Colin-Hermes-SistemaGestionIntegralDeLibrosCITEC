// Core types for the library management system

export type UserRole = "admin" | "staff" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  publisher: string
  year: number
  copies: number
  available: number
  coverUrl?: string
  description?: string
  createdAt: Date
}

export interface Student {
  id: string
  studentId: string
  name: string
  email: string
  phone: string
  department: string
  enrollmentYear: number
  status: "active" | "inactive" | "graduated"
  createdAt: Date
}

export interface Loan {
  id: string
  bookId: string
  studentId: string
  book?: Book
  student?: Student
  loanDate: Date
  dueDate: Date
  returnDate?: Date
  status: "active" | "returned" | "overdue"
  renewals: number
}

export interface Notification {
  id: string
  type: "loan" | "return" | "overdue" | "reminder" | "system"
  title: string
  message: string
  read: boolean
  createdAt: Date
  userId?: string
}

export interface DashboardStats {
  totalBooks: number
  totalStudents: number
  activeLoans: number
  overdueLoans: number
  booksAddedThisMonth: number
  loansThisMonth: number
}
