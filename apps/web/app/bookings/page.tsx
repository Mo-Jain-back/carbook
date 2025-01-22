"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

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
      },
      {
        id: 102,
        start: "2024-02-10T09:00:00",
        end: "2024-02-15T17:00:00",
        bookedBy: { name: "Jane Smith", contact: "+1987654321" },
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
      },
      {
        id: 202,
        start: "2024-02-20T08:00:00",
        end: "2024-02-25T19:00:00",
        bookedBy: { name: "Bob Williams", contact: "+1555666777" },
      },
    ],
  },
]

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
}

function getPickupTime(startTime: string) {
  const pickup = new Date(startTime)
  pickup.setMinutes(pickup.getMinutes() - 30)
  return formatDateTime(pickup.toISOString())
}

function getTimeUntilBooking(startTime: string) {
  const now = new Date()
  const start = new Date(startTime)
  const diffTime = start.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Trip has started"
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day"
  return `${diffDays} days`
}

export default function Bookings() {
  const [selectedCar, setSelectedCar] = useState<string>("all")

  const filteredBookings = userCars
    .flatMap((car) =>
      car.bookings.map((booking) => ({
        ...booking,
        car: {
          id: car.id,
          name: car.name,
          plateNumber: car.plateNumber,
          imageUrl: car.imageUrl,
        },
      })),
    )
    .filter((booking) => selectedCar === "all" || booking.car.id.toString() === selectedCar)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Select value={selectedCar} onValueChange={setSelectedCar}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select car" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cars</SelectItem>
              {userCars.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()}>
                  {car.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <Link href={`/bookings/${booking.id}`} key={index}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Top Section */}
                  <div className="p-4 bg-white">
                    <p className="text-sm text-muted-foreground">Guest shall pickup car by</p>
                    <p className="font-semibold">{getPickupTime(booking.start)}</p>
                  </div>

                  {/* Divider */}
                  <hr className="border-t border-border" />

                  {/* Middle Section */}
                  <div className="p-4 bg-white flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-semibold">{formatDateTime(booking.start)}</p>
                        </div>
                        <ArrowRight className="mt-4" />
                        <div>
                          <p className="text-sm text-muted-foreground">To</p>
                          <p className="font-semibold">{formatDateTime(booking.end)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center ml-4">
                      <div className="relative w-20 h-20 mb-2">
                        <Image
                          src={booking.car.imageUrl || "/placeholder.svg"}
                          alt={booking.car.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <p className="text-sm font-semibold">{booking.car.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.car.plateNumber}</p>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="p-4 bg-blue-50 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm">Trip start window opens in {getTimeUntilBooking(booking.start)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

