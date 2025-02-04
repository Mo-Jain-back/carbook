"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, LogIn, PlaneTakeoff, PlusCircle, PlusIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CarBookingDialog } from "@/components/add-booking"

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
  const [isAddBookingOpen,setIsAddBookingOpen] = useState(false);

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

      {/* Add Booking Dialog */}
        <CarBookingDialog isOpen={isAddBookingOpen} setIsOpen={setIsAddBookingOpen} />
        {/* Add Booking button */}
        <div className="fixed z-[50] sm:hidden bottom-[70px] right-5 flex items-center justify-start whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsAddBookingOpen(true)}
          >
          <button className="bg-black px-[15px] overflow-hidden  text-blue-100 hover:border hover:border-gray-700  shadow-lg  rounded-xl w-12 h-12 flex items-center shadow-lg transition-all duration-300 hover:w-40">
            <span className={`text-[30px] mt-[-3px] transition-rotate duration-400 flex items-center `}>+</span>
            <span className={` ${isHovered ? "" : "hidden"} ml-2 transition-opacity font-bold duration-300`}
            >Add Booking</span>
          </button>
        </div>

      
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 style={{fontFamily:"var(--font-equinox)"}} className="text-3xl max-sm:text-xl font-black">MY BOOKINGS</h1>
          <Select value={selectedCar} onValueChange={setSelectedCar} >
            <SelectTrigger className="w-[180px] hover:bg-gray-200 dark:hover:bg-gray-700">
              <SelectValue placeholder="Select car"  className=""/>
            </SelectTrigger>
            <SelectContent className="dark:border-gray-700">
              <SelectItem value="all" className="hover:bg-blue-100 hover:text-black cursor-pointer">All Cars</SelectItem>
              {userCars.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()} className="hover:bg-blue-100 cursor-pointer hover:text-black">
                  {car.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className=" flex justify-between w-full scrollbar-hide">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant={selectedStatus === "all" ? "default" : "outline"} className={selectedStatus === "all" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("all")}>
              All
            </Button>
            <Button
              variant={selectedStatus === "upcoming" ? "default" : "outline"} className={selectedStatus === "upcoming" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={selectedStatus === "ongoing" ? "default" : "outline"} className={selectedStatus === "ongoing" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("ongoing")}
            >
              Ongoing
            </Button>
            <Button
              variant={selectedStatus === "completed" ? "default" : "outline"} className={selectedStatus === "completed" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("completed")}
            >
              Completed
            </Button>
            <Button
              variant={selectedStatus === "cancelled" ? "default" : "outline"} className={selectedStatus === "cancelled" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("cancelled")}
            >
              Cancelled
            </Button>
          </div>
          <Button className="max-sm:hidden bg-blue-600 text-white hover:bg-opacity-10 dark:text-black shadow-lg"
            onClick={() => setIsAddBookingOpen(true)}>
            <span className={`text-[24px] mt-[-2px] `}>+</span>
            <span className="">Add Booking</span> 
          </Button>
        </div>


        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Link href={`/booking/${booking.id}`} key={booking.id}>
              <Card className="overflow-hidden hover:shadow-md dark:border-card transition-shadow my-2">
                <CardContent className="p-0">
                  {/* Rest of the card content remains the same */}
                  <div className="p-4 max-sm:p-2 bg-muted">
                    <p className="text-sm max-sm:text-xs text-blue-500">Guest shall pickup car by</p>
                    <p className="font-semibold text-[#5B4B49] max-sm:text-sm dark:text-gray-400">{getPickupTime(booking.start)}</p>
                  </div>
                  <hr className="border-t border-border" />
                  <div className="p-4 max-sm:p-2 bg-white dark:bg-background flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center sm:gap-8 gap-2">
                        <div>
                          <p className="text-xs sm:text-sm text-blue-500">From</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.start)}</p>
                        </div>
                        <ArrowRight className="mt-4 flex-shrink-0" />
                        <div>
                          <p className="sm:text-sm text-xs text-blue-500">To</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.end)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center ml-4">
                      <div className="relative sm:w-20 sm:h-20 w-12 h-12 mb-2">
                        <Image
                          src={booking.car.imageUrl || "/placeholder.svg"}
                          alt={booking.car.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <p className="text-sm max-sm:text-xs font-semibold">{booking.car.name}</p>
                      <p className="text-xs text-blue-400 max-sm:text-[10px]">{booking.car.plateNumber}</p>
                    </div>
                  </div>
                  <div className="p-4 max-sm:p-2 bg-gray-100 flex bg-muted items-center text-red-600 dark:text-red-400 gap-2">
                    <PlaneTakeoff className="h-4 w-4" />
                    <p className="text-sm max-sm:text-xs ">Trip start window opens in {getTimeUntilBooking(booking.start)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

