"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, PlusCircle, PlusIcon } from "lucide-react"
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

type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled" | "all"

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
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("all");
  const [isHovered, setIsHovered] = useState(false);

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
    .filter(
      (booking) =>
        (selectedCar === "all" || booking.car.id.toString() === selectedCar) &&
        (selectedStatus === "all" || booking.status === selectedStatus),
    )

  return (
    <div className="min-h-screen bg-background">
      
        {/* Add Booking button */}
        <div className="fixed sm:hidden bottom-[70px] right-5 flex items-center justify-start whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          <button className="bg-black  text-blue-100 hover:border hover:border-black  shadow-lg  rounded-xl w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:w-40">
            <span className={`text-[30px] mt-[-3px] transition-rotate duration-400 flex items-center `}>+</span>
            <span className={` ${isHovered ? "" : "hidden"} ml-2 transition-opacity font-bold duration-300`}
            >Add Booking</span>
          </button>
        </div>
        
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Select value={selectedCar} onValueChange={setSelectedCar} >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select car"  className="bg-blue-100"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="hover:bg-blue-100 hover:text-black">All Cars</SelectItem>
              {userCars.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()} className="hover:bg-blue-100 hover:text-black">
                  {car.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className=" flex justify-between w-full">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button variant={selectedStatus === "all" ? "default" : "outline"} className={selectedStatus === "all" ? "bg-blue-400 hover:bg-blue-500 text-white" : "hover:bg-blue-100 text-black"} 
              onClick={() => setSelectedStatus("all")}>
              All
            </Button>
            <Button
              variant={selectedStatus === "upcoming" ? "default" : "outline"} className={selectedStatus === "upcoming" ? "bg-blue-400 hover:bg-blue-500 text-white" : "hover:bg-blue-100 text-black"} 
              onClick={() => setSelectedStatus("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={selectedStatus === "ongoing" ? "default" : "outline"} className={selectedStatus === "ongoing" ? "bg-blue-400 hover:bg-blue-500 text-white" : "hover:bg-blue-100 text-black"} 
              onClick={() => setSelectedStatus("ongoing")}
            >
              Ongoing
            </Button>
            <Button
              variant={selectedStatus === "completed" ? "default" : "outline"} className={selectedStatus === "completed" ? "bg-blue-400 hover:bg-blue-500 text-white" : "hover:bg-blue-100 text-black"} 
              onClick={() => setSelectedStatus("completed")}
            >
              Completed
            </Button>
            <Button
              variant={selectedStatus === "cancelled" ? "default" : "outline"} className={selectedStatus === "cancelled" ? "bg-blue-400 hover:bg-blue-500 text-white" : "hover:bg-blue-100 text-black"} 
              onClick={() => setSelectedStatus("cancelled")}
            >
              Cancelled
            </Button>
          </div>
          <Button className="max-sm:hidden bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4 " />
            <span className="">Add Booking</span> 
          </Button>
        </div>


        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Link href={`/bookings/${booking.id}`} key={booking.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow my-2">
                <CardContent className="p-0">
                  {/* Rest of the card content remains the same */}
                  <div className="p-4 bg-blue-100 bg-opacity-20">
                    <p className="text-sm text-blue-500">Guest shall pickup car by</p>
                    <p className="font-semibold text-[#5B4B49]">{getPickupTime(booking.start)}</p>
                  </div>
                  <hr className="border-t border-border" />
                  <div className="p-4 bg-white flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-sm text-blue-500">From</p>
                          <p className="font-semibold text-[#5B4B49]">{formatDateTime(booking.start)}</p>
                        </div>
                        <ArrowRight className="mt-4" />
                        <div>
                          <p className="text-sm text-blue-500">To</p>
                          <p className="font-semibold text-[#5B4B49]">{formatDateTime(booking.end)}</p>
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
                      <p className="text-xs text-blue-400">{booking.car.plateNumber}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-100 flex items-center text-black gap-2">
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

