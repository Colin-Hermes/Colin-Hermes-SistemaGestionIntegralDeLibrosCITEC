import type { User, Book, Student, Loan, Notification } from "./types"

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@biblioteca.edu",
    name: "Carlos Administrador",
    role: "admin",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    email: "staff@biblioteca.edu",
    name: "María Bibliotecaria",
    role: "staff",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "3",
    email: "estudiante@universidad.edu",
    name: "Juan Estudiante",
    role: "student",
    createdAt: new Date("2023-09-01"),
  },
]

// Mock books
export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    isbn: "978-0307474728",
    category: "Literatura",
    publisher: "Vintage Español",
    year: 1967,
    copies: 5,
    available: 3,
    description: "Una obra maestra de la literatura latinoamericana.",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    title: "El principito",
    author: "Antoine de Saint-Exupéry",
    isbn: "978-0156012195",
    category: "Literatura",
    publisher: "Mariner Books",
    year: 1943,
    copies: 8,
    available: 5,
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Tecnología",
    publisher: "Prentice Hall",
    year: 2008,
    copies: 3,
    available: 1,
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    title: "Física Universitaria",
    author: "Sears y Zemansky",
    isbn: "978-6073227377",
    category: "Ciencias",
    publisher: "Pearson",
    year: 2018,
    copies: 10,
    available: 7,
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "5",
    title: "Cálculo de una variable",
    author: "James Stewart",
    isbn: "978-6075266688",
    category: "Matemáticas",
    publisher: "Cengage",
    year: 2020,
    copies: 6,
    available: 2,
    createdAt: new Date("2023-05-12"),
  },
  {
    id: "6",
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    isbn: "978-8491050094",
    category: "Literatura",
    publisher: "Espasa",
    year: 1605,
    copies: 4,
    available: 4,
    createdAt: new Date("2023-06-01"),
  },
]

// Mock students
export const mockStudents: Student[] = [
  {
    id: "1",
    studentId: "STU-2023-001",
    name: "Ana García López",
    email: "ana.garcia@universidad.edu",
    phone: "+52 555 123 4567",
    department: "Ingeniería en Sistemas",
    enrollmentYear: 2021,
    status: "active",
    createdAt: new Date("2021-08-15"),
  },
  {
    id: "2",
    studentId: "STU-2023-002",
    name: "Pedro Martínez Ruiz",
    email: "pedro.martinez@universidad.edu",
    phone: "+52 555 234 5678",
    department: "Medicina",
    enrollmentYear: 2020,
    status: "active",
    createdAt: new Date("2020-08-15"),
  },
  {
    id: "3",
    studentId: "STU-2023-003",
    name: "Laura Sánchez Torres",
    email: "laura.sanchez@universidad.edu",
    phone: "+52 555 345 6789",
    department: "Derecho",
    enrollmentYear: 2022,
    status: "active",
    createdAt: new Date("2022-08-15"),
  },
  {
    id: "4",
    studentId: "STU-2022-015",
    name: "Roberto Hernández",
    email: "roberto.hernandez@universidad.edu",
    phone: "+52 555 456 7890",
    department: "Arquitectura",
    enrollmentYear: 2019,
    status: "graduated",
    createdAt: new Date("2019-08-15"),
  },
]

// Mock loans
export const mockLoans: Loan[] = [
  {
    id: "1",
    bookId: "1",
    studentId: "1",
    loanDate: new Date("2024-01-05"),
    dueDate: new Date("2024-01-19"),
    status: "active",
    renewals: 0,
  },
  {
    id: "2",
    bookId: "3",
    studentId: "2",
    loanDate: new Date("2024-01-02"),
    dueDate: new Date("2024-01-16"),
    returnDate: new Date("2024-01-14"),
    status: "returned",
    renewals: 0,
  },
  {
    id: "3",
    bookId: "5",
    studentId: "1",
    loanDate: new Date("2023-12-20"),
    dueDate: new Date("2024-01-03"),
    status: "overdue",
    renewals: 1,
  },
  {
    id: "4",
    bookId: "2",
    studentId: "3",
    loanDate: new Date("2024-01-10"),
    dueDate: new Date("2024-01-24"),
    status: "active",
    renewals: 0,
  },
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "overdue",
    title: "Préstamo vencido",
    message: 'El libro "Cálculo de una variable" tiene 12 días de retraso.',
    read: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    type: "reminder",
    title: "Recordatorio de devolución",
    message: 'El libro "El principito" debe devolverse en 2 días.',
    read: false,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    type: "loan",
    title: "Nuevo préstamo registrado",
    message: "Se ha registrado un nuevo préstamo para Ana García.",
    read: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    type: "system",
    title: "Mantenimiento programado",
    message: "El sistema estará en mantenimiento el domingo de 2:00 a 4:00 AM.",
    read: true,
    createdAt: new Date("2024-01-08"),
  },
]

// Helper to get enriched loans with book and student data
export function getEnrichedLoans(): Loan[] {
  return mockLoans.map((loan) => ({
    ...loan,
    book: mockBooks.find((b) => b.id === loan.bookId),
    student: mockStudents.find((s) => s.id === loan.studentId),
  }))
}
