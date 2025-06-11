"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Eye, Edit, Trash2, Upload } from "lucide-react"
import { apiClient, type Document, type Category } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    file: null as File | null,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const categoriesData = await apiClient.getCategories()
      setCategories(categoriesData)

      // Load documents from all categories
      const allDocuments: Document[] = []
      for (const category of categoriesData) {
        const categoryDocs = await apiClient.getDocumentsByCategory(category.id)
        allDocuments.push(...categoryDocs)
      }
      setDocuments(allDocuments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!editingDocument && !formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("description", formData.description)
      submitData.append("categoryId", formData.categoryId)

      if (formData.file) {
        submitData.append("file", formData.file)
      }

      if (editingDocument) {
        await apiClient.updateDocument(editingDocument.id, submitData)
        toast({
          title: "Success",
          description: "Document updated successfully",
        })
      } else {
        await apiClient.uploadDocument(submitData)
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingDocument(null)
      setFormData({ title: "", description: "", categoryId: "", file: null })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (document: Document) => {
    setEditingDocument(document)
    setFormData({
      title: document.title,
      description: document.description,
      categoryId: document.category.id,
      file: null,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      await apiClient.deleteDocument(id)
      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", categoryId: "", file: null })
    setEditingDocument(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage your research documents and files</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingDocument ? "Edit Document" : "Upload New Document"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Document title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Document description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">File {editingDocument && "(optional)"}</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  required={!editingDocument}
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, Excel (.xlsx, .xls)</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  {editingDocument ? "Update" : "Upload"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            All Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{document.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{document.category.name}</Badge>
                  </TableCell>
                  <TableCell>{new Date(document.datePosted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.fileType.includes("pdf") ? "PDF" : "Excel"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(document.fileUrl, "_blank")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(document)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(document.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
