"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Newspaper, Edit, Trash2 } from "lucide-react"
import { apiClient, type News } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const data = await apiClient.getNews()
      setNews(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load news",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingNews) {
        await apiClient.updateNews(editingNews.id, formData)
        toast({
          title: "Success",
          description: "News updated successfully",
        })
      } else {
        await apiClient.createNews(formData)
        toast({
          title: "Success",
          description: "News created successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingNews(null)
      setFormData({ title: "", description: "" })
      loadNews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save news",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news article?")) return

    try {
      await apiClient.deleteNews(id)
      toast({
        title: "Success",
        description: "News deleted successfully",
      })
      loadNews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete news",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "" })
    setEditingNews(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNews ? "Edit News" : "Add New News"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="News title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="News content"
                  rows={6}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingNews ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="h-5 w-5 mr-2 text-purple-600" />
            All News ({news.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell className="font-medium">{newsItem.title}</TableCell>
                  <TableCell className="max-w-md truncate">{newsItem.description}</TableCell>
                  <TableCell>{new Date(newsItem.datePosted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(newsItem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(newsItem.id)}>
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
