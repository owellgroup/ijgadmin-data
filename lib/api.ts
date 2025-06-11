// Update API_BASE_URL to handle different environments
const API_BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "https://ijgapis-soci.onrender.com/api"
    : "https://ijgapis-soci.onrender.com/api"

// API client with error handling
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      // Return empty data instead of throwing an error
      return [] as unknown as T
    }
  }

  // Categories
  async getCategories() {
    try {
      return await this.request<Category[]>("/categories")
    } catch (error) {
      console.warn("Using mock categories data due to API error")
      return mockCategories
    }
  }

  async createCategory(name: string) {
    return this.request<Category>("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${encodeURIComponent(name)}`,
    })
  }

  async updateCategory(category: Category) {
    return this.request<Category>("/categories/api/updatecategory", {
      method: "PUT",
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(category: Category) {
    return this.request<Category>("/categories", {
      method: "DELETE",
      body: JSON.stringify(category),
    })
  }

  // Documents
  async getDocuments() {
    return this.request<Document[]>("/documents")
  }

  async getDocumentsByCategory(categoryId: string) {
    try {
      return await this.request<Document[]>(`/documents/category/${categoryId}`)
    } catch (error) {
      console.warn(`Using mock documents data for category ${categoryId} due to API error`)
      return mockDocuments.filter((doc) => doc.category.id === categoryId)
    }
  }

  async uploadDocument(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }
    return response.json()
  }

  async updateDocument(id: number, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/documents/update/${id}`, {
      method: "PUT",
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`)
    }
    return response.json()
  }

  async deleteDocument(id: number) {
    return fetch(`${API_BASE_URL}/documents/delete/${id}`, {
      method: "DELETE",
    })
  }

  // News
  async getNews() {
    try {
      return await this.request<News[]>("/news")
    } catch (error) {
      console.warn("Using mock news data due to API error")
      return mockNews
    }
  }

  async createNews(news: Omit<News, "id" | "datePosted">) {
    return this.request<News>("/news", {
      method: "POST",
      body: JSON.stringify(news),
    })
  }

  async updateNews(id: number, news: Omit<News, "id" | "datePosted">) {
    return this.request<News>(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(news),
    })
  }

  async deleteNews(id: number) {
    return fetch(`${API_BASE_URL}/news/${id}`, {
      method: "DELETE",
    })
  }

  // Authentication
  async login(email: string, password: string) {
    try {
      // First get user by email
      const response = await fetch(`${API_BASE_URL}/users/email/${email}`)
      if (!response.ok) {
        throw new Error("User not found")
      }
      const user = await response.json()

      // In a real app, you'd verify password on backend
      // For now, we'll do basic client-side check
      if (user.password === password) {
        // Store user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user))
        return { success: true, user }
      } else {
        throw new Error("Invalid password")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  async logout() {
    localStorage.removeItem("currentUser")
    return { success: true }
  }

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("currentUser")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Users
  async getUsers() {
    try {
      return await this.request<User[]>("/users")
    } catch (error) {
      console.warn("Using mock users data due to API error")
      return mockUsers
    }
  }

  async createUser(user: Omit<User, "id">) {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }

  async updateUser(id: number, user: Omit<User, "id">) {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...user, id }),
    })
  }

  async deleteUser(id: number) {
    return fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()

// Types
export interface Category {
  id: string
  name: string
}

export interface Document {
  id: number
  title: string
  description: string
  fileType: string
  fileUrl: string
  datePosted: string
  category: Category
}

export interface News {
  id: number
  title: string
  description: string
  datePosted: string
}

export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  email: string
  password?: string
  role: Role
  name: string
}

// Import mock data
import { mockCategories, mockDocuments, mockNews, mockUsers } from "./mock-data"
