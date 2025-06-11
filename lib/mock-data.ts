import type { Category, Document, News, User, Role } from "./api"

// Mock roles
export const mockRoles: Role[] = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Viewer" },
]

// Mock categories
export const mockCategories: Category[] = [
  { id: "1", name: "Research Papers" },
  { id: "2", name: "Financial Reports" },
  { id: "3", name: "Market Analysis" },
  { id: "4", name: "Policy Documents" },
]

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Annual Financial Report 2024",
    description: "Comprehensive financial analysis for the year 2024",
    fileType: "application/pdf",
    fileUrl: "#",
    datePosted: new Date().toISOString(),
    category: mockCategories[1],
  },
  {
    id: 2,
    title: "Market Research Q4",
    description: "Quarterly market analysis and trends",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileUrl: "#",
    datePosted: new Date(Date.now() - 86400000).toISOString(),
    category: mockCategories[2],
  },
  {
    id: 3,
    title: "Policy Framework 2024-2025",
    description: "Updated policy framework for the next fiscal year",
    fileType: "application/pdf",
    fileUrl: "#",
    datePosted: new Date(Date.now() - 172800000).toISOString(),
    category: mockCategories[3],
  },
  {
    id: 4,
    title: "Research Findings: Economic Impact",
    description: "Analysis of economic impact in the region",
    fileType: "application/pdf",
    fileUrl: "#",
    datePosted: new Date(Date.now() - 259200000).toISOString(),
    category: mockCategories[0],
  },
]

// Mock news
export const mockNews: News[] = [
  {
    id: 1,
    title: "New Research Initiative Launched",
    description: "IJG Research announces a new initiative focused on sustainable development in the region.",
    datePosted: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Quarterly Economic Review Published",
    description: "Our latest economic review highlights growth opportunities in key sectors.",
    datePosted: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "IJG Partners with International Organizations",
    description: "New partnerships aim to enhance research capabilities and global reach.",
    datePosted: new Date(Date.now() - 172800000).toISOString(),
  },
]

// Update mock users to match your User model:
export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "admin@ijg.com",
    password: "admin123",
    role: mockRoles[0],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "editor@ijg.com",
    password: "editor123",
    role: mockRoles[1],
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "viewer@ijg.com",
    password: "viewer123",
    role: mockRoles[2],
  },
]
