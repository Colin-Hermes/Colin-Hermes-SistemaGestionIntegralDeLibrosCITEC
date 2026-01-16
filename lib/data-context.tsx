"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Book, Student, Loan, Notification } from "./types"
import { mockBooks, mockStudents, mockLoans, mockNotifications } from "./mock-data"

interface DataContextType {
  // Books
  books: Book[]
  addBook: (book: Omit<Book, "id" | "createdAt">) => void
  updateBook: (id: string, book: Partial<Book>) => void
  deleteBook: (id: string) => void

  // Students
  students: Student[]
  addStudent: (student: Omit<Student, "id" | "createdAt">) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Loans
  loans: Loan[]
  addLoan: (loan: Omit<Loan, "id">) => void
  updateLoan: (id: string, loan: Partial<Loan>) => void
  returnBook: (loanId: string) => void
  renewLoan: (loanId: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void

  // Helpers
  getBookById: (id: string) => Book | undefined
  getStudentById: (id: string) => Student | undefined
  getStudentLoans: (studentId: string) => Loan[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  // Books CRUD
  const addBook = useCallback((book: Omit<Book, "id" | "createdAt">) => {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setBooks((prev) => [...prev, newBook])
  }, [])

  const updateBook = useCallback((id: string, book: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...book } : b)))
  }, [])

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // Students CRUD
  const addStudent = useCallback((student: Omit<Student, "id" | "createdAt">) => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setStudents((prev) => [...prev, newStudent])
  }, [])

  const updateStudent = useCallback((id: string, student: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...student } : s)))
  }, [])

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // Loans CRUD
  const addLoan = useCallback(
    (loan: Omit<Loan, "id">) => {
      const newLoan: Loan = {
        ...loan,
        id: crypto.randomUUID(),
      }
      setLoans((prev) => [...prev, newLoan])

      // Update book availability
      setBooks((prev) =>
        prev.map((b) => (b.id === loan.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b)),
      )

      // Add notification
      const book = books.find((b) => b.id === loan.bookId)
      const student = students.find((s) => s.id === loan.studentId)
      addNotification({
        type: "loan",
        title: "Nuevo préstamo registrado",
        message: `${student?.name} ha prestado "${book?.title}"`,
        read: false,
        userId: loan.studentId,
      })
    },
    [books, students],
  )

  const updateLoan = useCallback((id: string, loan: Partial<Loan>) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...loan } : l)))
  }, [])

  const returnBook = useCallback(
    (loanId: string) => {
      const loan = loans.find((l) => l.id === loanId)
      if (!loan) return

      setLoans((prev) =>
        prev.map((l) => (l.id === loanId ? { ...l, status: "returned" as const, returnDate: new Date() } : l)),
      )

      setBooks((prev) => prev.map((b) => (b.id === loan.bookId ? { ...b, available: b.available + 1 } : b)))

      const book = books.find((b) => b.id === loan.bookId)
      addNotification({
        type: "return",
        title: "Libro devuelto",
        message: `"${book?.title}" ha sido devuelto`,
        read: false,
      })
    },
    [loans, books],
  )

  const renewLoan = useCallback((loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId && l.renewals < 2) {
          const newDueDate = new Date(l.dueDate)
          newDueDate.setDate(newDueDate.getDate() + 14)
          return { ...l, dueDate: newDueDate, renewals: l.renewals + 1, status: "active" as const }
        }
        return l
      }),
    )
  }, [])

  // Notifications
  const addNotification = useCallback((notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  // Helpers
  const getBookById = useCallback((id: string) => books.find((b) => b.id === id), [books])

  const getStudentById = useCallback((id: string) => students.find((s) => s.id === id), [students])

  const getStudentLoans = useCallback((studentId: string) => loans.filter((l) => l.studentId === studentId), [loans])

  return (
    <DataContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        loans,
        addLoan,
        updateLoan,
        returnBook,
        renewLoan,
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getBookById,
        getStudentById,
        getStudentLoans,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
