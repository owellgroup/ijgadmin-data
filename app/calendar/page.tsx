"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Plus, CalendarIcon, Clock, MapPin } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  date: Date
  time: string
  location?: string
  type: "meeting" | "deadline" | "event"
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Research Review Meeting",
    description: "Monthly review of research progress",
    date: new Date(2024, 11, 15),
    time: "10:00 AM",
    location: "Conference Room A",
    type: "meeting",
  },
  {
    id: 2,
    title: "Document Submission Deadline",
    description: "Final deadline for Q4 research documents",
    date: new Date(2024, 11, 20),
    time: "5:00 PM",
    type: "deadline",
  },
  {
    id: 3,
    title: "IJG Annual Conference",
    description: "Annual research conference and networking event",
    date: new Date(2024, 11, 25),
    time: "9:00 AM",
    location: "Main Auditorium",
    type: "event",
  },
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    type: "meeting" as Event["type"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.time.trim() || !date) {
      alert("Please fill in required fields")
      return
    }

    const newEvent: Event = {
      id: Math.max(...events.map((e) => e.id)) + 1,
      ...formData,
      date: date,
    }

    setEvents([...events, newEvent])
    setIsDialogOpen(false)
    setFormData({
      title: "",
      description: "",
      time: "",
      location: "",
      type: "meeting",
    })
  }

  const getEventsForDate = (selectedDate: Date) => {
    return events.filter((event) => event.date.toDateString() === selectedDate.toDateString())
  }

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "deadline":
        return "bg-red-100 text-red-800"
      case "event":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedDateEvents = date ? getEventsForDate(date) : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage events, meetings, and deadlines</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g., 10:00 AM"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location"
                />
              </div>
              <div>
                <Label htmlFor="type">Event Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Event["type"] })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
              modifiers={{
                hasEvents: events.map((event) => event.date),
              }}
              modifiersStyles={{
                hasEvents: { backgroundColor: "#dbeafe", color: "#1e40af" },
              }}
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Events for {date?.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 6)
              .map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {event.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
