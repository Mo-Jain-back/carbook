"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Edit } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import dayjs from "dayjs";
import AddTime from "@/components/add-time";
import { useEffect } from "react";
import { useRef } from "react";


interface BookingDetailsClientProps {
  booking: {
    id: number
    start: string
    end: string
    status: string
    cancelledBy: string | null
    car: {
      name: string
      plateNumber: string
      imageUrl: string
    }
    bookedBy: {
      name: string
      contact: string
    }
  },
  status?: string
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })
}

export function BookingDetailsClient({ booking }: BookingDetailsClientProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action,setAction] = useState<"Start"| "Stop">("Start");
  const [status,setStatus] = useState<"Start"| "Stop">("Start");
  const [isEditable, setIsEditable] = useState(false);
  const [startDate, setStartDate] = useState(new Date(booking.start));
  const [endDate,setEndDate] = useState(new Date(booking.end));
  const [startTime,setStartTime] = useState(booking.start.split("T")[1].slice(0, 5));
  const [endTime,setEndTime] = useState(booking.end.split("T")[1].slice(0, 5));
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const statusInputRef = useRef<HTMLInputElement>(null);
  const [bookingStatus, setBookingStatus] = useState(booking.status);

  useEffect(() => {
    if (isEditingStatus && statusInputRef.current) {
      statusInputRef.current.focus()
    }
  }, [isEditingStatus])

  function handleAction() {
    //add code to stop or start the booking
    const newStatus  = action == "Start" ? "Stop" : "Start";
    setStatus(newStatus);
    return;
  }

  const handleDateChange = (date:Date,type?:string) => {
    if(type === "start") {
      setStartDate(date);
    } else if(type === "end") {
      setEndDate(date);
    }
  }

  function handleClick() {
    //add code to stop or start the booking

    return;
  }

  function handleCancel() {
    //add code to stop or start the booking
    setIsEditable(!isEditable);
    setStartDate(new Date(booking.start));
    setEndDate(new Date(booking.end));
    return;
  }
  function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBookingStatus(e.target.value);
  }

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest("#status-field")) {
          setIsEditingStatus(false)
        }
      }
    }
  
  return (
    <>
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-300" onClick={handleClickOutside}>
        <button onClick={() => router.back()} className="text-black hover:bg-black hover:text-blue-100 p-2 rounded-md">
          <div className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-black">Booking {bookingStatus}</h2>
          <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
        </div>
        <div className="rounded-md mr-4 p-2 cursor-pointer text-black hover:bg-black hover:text-blue-100" onClick={handleCancel}>
          <Edit  className="h-6 w-6 " />
        </div> {/* Spacer for alignment */}
      </div>

      <div className="px-4 py-4 border-b-4 border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {bookingStatus === "cancelled" ? (
                <>
                  <p className="text-sm text-blue-500">
                    Booking was cancelled by {booking.cancelledBy === "you" ? "you" : "guest"}
                  </p>
                  <p className="font-semibold">{formatDateTime(endDate)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-blue-500">
                    {bookingStatus === "completed" ? "Guest returned at" : "Guest shall return by"}
                  </p>
                  <p className="font-semibold">{formatDateTime(endDate)}</p>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="relative w-20 h-20 mb-2">
                <Image
                  src={booking.car.imageUrl || "/placeholder.svg"}
                  alt={booking.car.name}
                  priority
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="text-sm font-semibold text-[#4B4237]">{booking.car.name}</p>
              <p className="text-xs text-blue-500">{booking.car.plateNumber}</p>
            </div>
          </div>
      </div>

      <div className="px-4 py-4 border-b-4 border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-black">Booking Details</h3>
          <div className="flex items-center justify-center gap-8 mb-4">
            <div>
              <p className="text-sm text-blue-500">From</p>
              {!isEditable ?
              <p className="font-semibold">{formatDateTime(startDate)}</p>
              : 
              <div className="flex space-x-2">
                <div className="">
                  <DatePicker currDate={dayjs(startDate)} handleDateChange={handleDateChange} dateType="start"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="p-0 m-0 w-[50px] border-none bg-gray-200 hover:bg-gray-300 rounded-sm" currTime={startTime} onTimeSelect={setStartTime} />
                  <input type="hidden" name="time" value={startTime} />
                </div>
              </div>
              }
            </div>
            <ArrowRight className="mt-4" />
            <div>
              <p className="text-sm text-blue-500">To</p>
              {!isEditable ?
              <p className="font-semibold">{formatDateTime(endDate)}</p>
              :
              <div className="flex space-x-2">
                <div className="">
                  <DatePicker currDate={dayjs(endDate)} handleDateChange={handleDateChange} dateType="end"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="p-0 m-0 w-[50px] border-none bg-gray-200 hover:bg-gray-300 rounded-sm" currTime={endTime} onTimeSelect={setEndTime} />
                <input type="hidden" name="time" value={endTime} />
              </div>
              </div>
            }
            </div>
          </div>
          <hr className="my-4 border-gray-200" />
          <div>
            <p className="text-sm text-blue-500 mb-1">Booked by</p>
            <p className="font-semibold">{booking.bookedBy.name}</p>
            <p className="text-sm">{booking.bookedBy.contact}</p>
          </div>
          <hr className="my-4 border-gray-200" />
          <div>
            <p className="text-sm text-blue-500 mb-1">Booking Status</p>
            <div className={`${!isEditingStatus ? "border-gray-200" :"border-blue-300"} ${isEditable ? "border-b-2" : ""} pb-3`} id="status-field">
              {isEditingStatus ? (
                <input
                  ref={statusInputRef}
                  type="text"
                  id="username"
                  value={bookingStatus}
                  onChange={handleStatusChange}
                  className="block w-full border-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                />
              ) : (
                <p className={`  font-semibold`} onClick={() => setIsEditingStatus(true)}>{bookingStatus}</p>
              )}
            </div>
          </div>
          
      </div>
      {!isEditable && <div className=" flex justify-center space-x-2 mt-2" onClick={handleClick}>
        {status == "Start" ? 
        <Button className="px-4 py-4 max-sm:w-full bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg"
          onClick={() => {
            setAction("Start")
            setIsDialogOpen(true)
          }}>
          <span className="" >Start Booking</span> 
        </Button>
        :
        <Button className="px-4 py-4 max-sm:w-full bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg"
        onClick={() => {
          setIsDialogOpen(true);
          setAction("Stop");
        }}>
          <span className="">Stop Booking</span> 
        </Button>}
      </div>}
      {isEditable && <div className=" flex justify-center space-x-2 mt-2">
        <>
          <Button className="px-4 py-4 max-sm:w-full bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg"
          onClick={() => {
            setIsEditable(false);
          }}>
            <span className="">Update Bookings</span> 
          </Button>
          <Button className="px-4 py-4 max-sm:w-full bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg"
          onClick={handleCancel}>
            <span className="">Cancel Update</span> 
          </Button>

        </>
      </div>}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>{action}</DialogTitle>
              <DialogDescription className="text-blue-500">
                "Are you sure you want to {action} the booking?" 
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button className="max-sm:w-full bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg" onClick={() => {
                handleAction();
                setIsDialogOpen(false)
              }}>{action}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}

