"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

// This would typically come from a database or API
const userCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-01", end: "2023-06-03" },
      { start: "2023-06-10", end: "2023-06-15" },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-05", end: "2023-06-07" },
      { start: "2023-06-20", end: "2023-06-25" },
    ],
  },
  {
    id: 3,
    name: "Toyota Camry",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-08", end: "2023-06-09" },
      { start: "2023-06-18", end: "2023-06-22" },
    ],
  },
]

export default function CarBookings({ params }: { params: { id: string } }) {
  const car = userCars.find((car) => car.id === Number.parseInt(params.id))
  const [date, setDate] = useState<Date | undefined>(new Date())

  if (!car) {
    return <div>Car not found</div>
  }

  const bookedDays = car.bookings.flatMap((booking) => {
    const days = []
    const start = new Date(booking.start)
    const end = new Date(booking.end)
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day))
    }
    return days
  })

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <h1 className="text-3xl font-bold mb-6">{car.name} Bookings</h1>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            booked: bookedDays,
          }}
          modifiersStyles={{
            booked: { backgroundColor: "lightblue" },
          }}
        />
      </main>
      <BottomNav />
    </div>
  )
}

