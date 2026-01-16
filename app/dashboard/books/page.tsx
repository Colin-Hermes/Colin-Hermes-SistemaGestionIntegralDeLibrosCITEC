"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/dashboard/header"
import { BooksTable } from "@/components/books/books-table"
import { BookFormDialog } from "@/components/books/book-form-dialog"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import type { Book } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Filter, X } from "lucide-react"

const categories = ["Todos", "Literatura", "Tecnología", "Ciencias", "Matemáticas", "Historia", "Arte", "Filosofía"]

export default function BooksPage() {
  const { books } = useData()
  const { hasPermission } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const canManageBooks = hasPermission(["admin", "staff"])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower)

      // Category filter
      const matchesCategory = selectedCategory === "Todos" || book.category === selectedCategory

      // Availability filter
      let matchesAvailability = true
      if (availabilityFilter === "available") {
        matchesAvailability = book.available > 0
      } else if (availabilityFilter === "unavailable") {
        matchesAvailability = book.available === 0
      }

      return matchesSearch && matchesCategory && matchesAvailability
    })
  }, [books, searchQuery, selectedCategory, availabilityFilter])

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setEditingBook(null)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("Todos")
    setAvailabilityFilter("all")
  }

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "Todos" || availabilityFilter !== "all"

  return (
    <div className="flex flex-col h-full">
      <Header title="Catálogo de Libros" />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, autor o ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Availability Filter */}
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="unavailable">No disponibles</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                  <X className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}

              {/* Add Book Button */}
              {canManageBooks && (
                <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Libro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredBooks.length} de {books.length} libros
          </p>
        </div>

        {/* Books Table */}
        <BooksTable books={filteredBooks} onEdit={handleEdit} />
      </div>

      {/* Book Form Dialog */}
      <BookFormDialog open={isDialogOpen} onOpenChange={handleCloseDialog} book={editingBook} />
    </div>
  )
}
