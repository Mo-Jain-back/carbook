import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Suspense } from "react"
import { BookingDetailsClient } from "./booking-details-client"

// This would typically come from a database or API
const userCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    plateNumber: "ABC 123",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      {
        id: 101,
        start: "2024-01-25T10:00:00",
        end: "2024-01-27T18:00:00",
        bookedBy: { name: "John Doe", contact: "+1234567890" },
        status: "upcoming",
        cancelledBy: null,
      },
      {
        id: 102,
        start: "2024-02-10T09:00:00",
        end: "2024-02-15T17:00:00",
        bookedBy: { name: "Jane Smith", contact: "+1987654321" },
        status: "cancelled",
        cancelledBy: "guest",
      },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    plateNumber: "XYZ 789",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      {
        id: 201,
        start: "2024-01-28T11:00:00",
        end: "2024-01-30T16:00:00",
        bookedBy: { name: "Alice Johnson", contact: "+1122334455" },
        status: "ongoing",
        cancelledBy: null,
      },
      {
        id: 202,
        start: "2024-02-20T08:00:00",
        end: "2024-02-25T19:00:00",
        bookedBy: { name: "Bob Williams", contact: "+1555666777" },
        status: "completed",
        cancelledBy: null,
      },
    ],
  },
]

function getBookingStatus(start: string, end: string) {
  const now = new Date()
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (now < startDate) return "Booking Yet to Start"
  if (now >= startDate && now <= endDate) return "Booking Ongoing"
  return "Booking Completed"
}

export default async function BookingDetails({ params }: { params: { id: string } }) {
  const bookingId = Number(params.id); // Resolve params.id synchronously after awaiting params

  

  const booking = userCars
    .flatMap((car) =>
      car.bookings.map((booking) => ({
        ...booking,
        car: {
          id: car.id,
          name: car.name,
          plateNumber: car.plateNumber,
          imageUrl: car.imageUrl,
        },
      }))
    )
    .find((b) => b.id === bookingId)

  if (!booking) {
    return <div>Booking not found</div>
  }

  const status = getBookingStatus(booking.start, booking.end)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div>Loading booking details...</div>}>
          <BookingDetailsClient booking={booking} status={status} />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}
