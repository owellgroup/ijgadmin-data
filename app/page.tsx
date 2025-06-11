"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, Newspaper, Users, TrendingUp, CalendarIcon, Download, Eye } from "lucide-react"
import { apiClient, type Document, type News } from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"

export default function Dashboard() {
  const [stats, setStats] = useState({
    documents: 0,
    categories: 0,
    news: 0,
    users: 12, // Mock data since no user API
  })
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([])
  const [recentNews, setRecentNews] = useState<News[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Add loading state
  const [loading, setLoading] = useState(true)

  // Update useEffect to handle loading state
  useEffect(() => {
    setLoading(true)
    loadDashboardData().finally(() => setLoading(false))
  }, [])

  // Update the loadDashboardData function to handle API failures
  const loadDashboardData = async () => {
    try {
      // Use Promise.allSettled instead of Promise.all to handle partial failures
      const [categoriesResult, newsResult] = await Promise.allSettled([apiClient.getCategories(), apiClient.getNews()])

      // Extract data safely, providing fallbacks for rejected promises
      const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : []
      const news = newsResult.status === "fulfilled" ? newsResult.value : []

      // Get documents from all categories with error handling
      const allDocuments: Document[] = []
      if (categories.length > 0) {
        for (const category of categories) {
          try {
            const categoryDocs = await apiClient.getDocumentsByCategory(category.id)
            allDocuments.push(...categoryDocs)
          } catch (error) {
            console.error(`Failed to fetch documents for category ${category.id}:`, error)
          }
        }
      }

      setStats({
        documents: allDocuments.length,
        categories: categories.length,
        news: news.length,
        users: 12,
      })

      // Get recent documents (last 5)
      const sortedDocs = allDocuments
        .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
        .slice(0, 5)
      setRecentDocuments(sortedDocs)

      // Get recent news (last 3)
      const sortedNews = news
        .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
        .slice(0, 3)
      setRecentNews(sortedNews)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      // Set default values if everything fails
      setStats({
        documents: 0,
        categories: 0,
        news: 0,
        users: 12,
      })
    }
  }

  const statCards = [
    {
      title: "Total Documents",
      value: stats.documents,
      icon: FileText,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      title: "News Articles",
      value: stats.news,
      icon: Newspaper,
      color: "bg-purple-500",
      change: "+8%",
    },
    {
      title: "Active Users",
      value: stats.users,
      icon: Users,
      color: "bg-orange-500",
      change: "+3%",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to IJG Research Admin</h1>
        <p className="text-blue-100">Manage your documents, categories, and content efficiently</p>
      </div>

      {/* Add loading UI to the dashboard */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="h-20 animate-pulse bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="h-6 animate-pulse bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 animate-pulse bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 animate-pulse bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Documents */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <Badge variant="secondary">{doc.category.name}</Badge>
                          <span className="text-xs text-gray-500">{new Date(doc.datePosted).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>
          </div>

          {/* Recent News */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-blue-600" />
                Recent News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{news.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{news.description}</p>
                    <span className="text-xs text-gray-500">{new Date(news.datePosted).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
