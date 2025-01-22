"use client"

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

interface Booking {
  start: string
  end: string
}

interface CalendarClientProps {
  bookings: Booking[]
}

export default function CalendarClient({ bookings }: CalendarClientProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const bookedDays = bookings.flatMap((booking) => {
    const days = []
    const start = new Date(booking.start)
    const end = new Date(booking.end)
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day))
    }
    return days
  })

  return (
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
  )
}

