"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {  Clock, LogIn, PlaneTakeoff, Plus, PlusCircle, PlusIcon, PlusSquare } from "lucide-react"
import Image from "next/image"
import { use, useEffect, useState } from "react"
import { CarBookingDialog } from "@/components/add-booking";
import ArrowRight from "@/public/right_arrow.svg";
import CarIcon from "@/public/car-icon.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import LoadingScreen from "@/components/loading-screen"
import { cn } from "@/lib/utils"
import { useCarStore } from "@/lib/store"


type BookingStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "All"

function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
}

function getPickupTime(startDate: string,startTime: string) {
  
  let [hours, minutes] = startTime.split(":").map(Number);
  let currDate = new Date();
  currDate.setHours(hours);
  currDate.setMinutes(minutes - 30); // Subtract 30 minutes

  // Format back to HH:MM
  let newHours = currDate.getHours().toString().padStart(2, "0");
  let newMinutes = currDate.getMinutes().toString().padStart(2, "0");

  const pickup = new Date(startDate); 
  
  if (newHours === "23" && Number(newMinutes) >= 30) {
    pickup.setDate(pickup.getDate() - 1); // Add a day
  }

  console.log("Number(newMinutes) > 30",newMinutes,Number(newMinutes) > 30)

  const date = pickup.toDateString().replaceAll(' ',', ');
  return `${date} ${newHours}:${newMinutes}`;
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
interface Car {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  imageUrl: string;
}


interface Booking{
  id: number;
  carId: number;
  carImageUrl: string;
  carName: string;
  carPlateNumber: string;
  customerContact: string;
  customerName: string;
  end: string; // ISO 8601 date string
  start: string; // ISO 8601 date string
  startTime: string;
  endTime: string;
  status: string;
}

export default function Bookings() {
  const {cars} = useCarStore();
  const [selectedCar, setSelectedCar] = useState<string>("All")
  const [bookings,setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("All");
  const [isHovered, setIsHovered] = useState(false);
  const [isAddBookingOpen,setIsAddBookingOpen] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res1 = await axios.get(`${BASE_URL}/api/v1/booking/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
          console.log("res1.data.bookings",res1.data.bookings);
        setBookings(res1.data.bookings);
        console.log("bookings",bookings);

      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    const newfilteredBookings = bookings.filter(
      (booking) =>
        (selectedCar === "All" || booking.carId.toString() === selectedCar) &&
        (selectedStatus === "All" || booking.status === selectedStatus),
    )

    setFilteredBookings(newfilteredBookings);
  },[bookings,selectedCar,selectedStatus])

  
 

  return (
    <div className="min-h-screen bg-background">

      {/* Add Booking Dialog */}
        {cars && cars.length > 0 &&
          <CarBookingDialog cars={cars} isOpen={isAddBookingOpen} setIsOpen={setIsAddBookingOpen} />
        }
        {/* Add Booking button */}
        <div className="fixed z-[50] sm:hidden bottom-[70px] right-5 flex items-center justify-start whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsAddBookingOpen(true)}
          >
          <div className={cn("bg-black px-[15px] overflow-hidden  text-blue-100 hover:border hover:border-gray-700  shadow-lg  rounded-xl w-12 h-12 flex items-center shadow-lg transition-all duration-300 hover:w-40",
            cars && cars.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
          )}>
            {/*<span className={`text-[30px] mt-[-3px] transition-rotate rotate-0 hover:rotate-180 duration-400 flex items-center `}>+</span> */}
            <Plus className="w-8 h-8 stroke-10" />
            <span className={` ${isHovered ? "opacity-100" : "hidden opacity-0"} ml-2 transition-opacity font-bold duration-300`}
            >Add Booking</span>
          </div>
        </div>

      
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 style={{fontFamily:"var(--font-equinox)"}} className="text-3xl max-sm:text-xl font-black">MY BOOKINGS</h1>
          <Select value={selectedCar} onValueChange={setSelectedCar} >
            <SelectTrigger className="w-[180px] hover:bg-gray-200 dark:hover:bg-gray-700">
              <SelectValue placeholder="Select car"/>
            </SelectTrigger>
            <SelectContent className="dark:border-gray-700">
              <SelectItem value="All" className="hover:bg-blue-100 hover:text-black cursor-pointer">All Cars</SelectItem>
              {cars && cars.length > 0 && cars.map((car) => (
                <SelectItem key={car.id} value={car.id.toString()} className="hover:bg-blue-100 cursor-pointer hover:text-black">
                  {car.brand + " " + car.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className=" flex justify-between w-full scrollbar-hide">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant={selectedStatus === "All" ? "default" : "outline"} className={selectedStatus === "All" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("All")}>
              All
            </Button>
            <Button
              variant={selectedStatus === "Upcoming" ? "default" : "outline"} className={selectedStatus === "Upcoming" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={selectedStatus === "Ongoing" ? "default" : "outline"} className={selectedStatus === "Ongoing" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Ongoing")}
            >
              Ongoing
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"} className={selectedStatus === "Completed" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Completed")}
            >
              Completed
            </Button>
            <Button
              variant={selectedStatus === "Cancelled" ? "default" : "outline"} className={selectedStatus === "Cancelled" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Cancelled")}
            >
              Cancelled
            </Button>
          </div>
          <Button className="max-sm:hidden bg-blue-600 text-white hover:bg-opacity-10 dark:text-black shadow-lg"
            onClick={() => setIsAddBookingOpen(true)}>
            <PlusSquare className="h-12 w-12" />
            <span className="">Add Booking</span> 
          </Button>
        </div>


        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Link href={`/booking/${booking.id}`} key={booking.id}>
              <Card className="overflow-hidden hover:shadow-md dark:border-card transition-shadow my-2">
                <CardContent className="p-0">
                  {/* Rest of the card content remains the same */}
                  <div className="flex justify-between bg-muted sm:pr-12 pr-2 items-center">
                    <div className="p-4 max-sm:p-2">
                      <p className="text-sm max-sm:text-xs text-blue-500">Guest shall pickup car by</p>
                      <p className="font-semibold text-[#5B4B49] max-sm:text-sm dark:text-gray-400">{getPickupTime(booking.start,booking.startTime)} </p>
                    </div>
                    <div className="p-4 max-sm:p-2">
                      <p className="text-sm max-sm:text-xs text-blue-500">Booking Id</p>
                      <p className=" text-[#5B4B49] max-sm:text-xs text-sm dark:text-gray-400">{booking.id} </p>
                    </div>
                  </div>
                  <hr className="border-t border-border" />
                  <div className="p-4 max-sm:p-2 bg-white dark:bg-background flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center sm:gap-8 gap-2">
                        <div>
                          <p className="text-xs sm:text-sm text-blue-500">From</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.start)} {booking.startTime}</p>
                        </div>
                        <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
                        <div>
                          <p className="sm:text-sm text-xs text-blue-500">To</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.end)} {booking.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center w-full sm:w-4/5 justify-between mt-2 sm:mt-8 sm:gap-8 gap-2">
                        <div>
                          <p className="text-xs sm:text-sm text-blue-500">Booked By</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerName}</p>
                        </div>
                        <div>
                          <p className="sm:text-sm text-xs text-blue-500">Contact</p>
                          <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerContact}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center ml-4">
                      <div className="relative sm:w-24 flex items-center sm:h-20 rounded-md border border-border w-12 h-12 mb-2"> 
                        { booking.carImageUrl ?
                          <Image
                          src={booking.carImageUrl}
                          alt={booking.carName}
                          fill
                          className="object-cover rounded w-full"
                        />
                        :
                        <CarIcon className="w-full dark:stroke-blue-200  dark:fill-blue-200 p-1 stroke-black fill-black" /> 
                        }
                      </div>
                      <p className="text-sm max-sm:text-xs font-semibold">{booking.carName}</p>
                      <p className="text-xs text-blue-400 max-sm:text-[10px]">{booking.carPlateNumber}</p>
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

