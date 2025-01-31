"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";


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

export function BookingDetailsClient({ booking }: BookingDetailsClientProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action,setAction] = useState<"Start"| "Stop">("Start");
  const [status,setStatus] = useState<"Start"| "Stop">("Start");

  function handleAction() {
    //add code to stop or start the booking
    const newStatus  = action == "Start" ? "Stop" : "Start";
    setStatus(newStatus);
    return;
  }

  function handleClick() {
    //add code to stop or start the booking

    return;
  }


  

  return (
    <>
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-300">
        <button onClick={() => router.back()} className="text-primary">
          <ArrowLeft color="blue" className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-black">Booking {booking.status}</h2>
          <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
        </div>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="px-4 py-4 border-b-4 border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {booking.status === "cancelled" ? (
                <>
                  <p className="text-sm text-blue-500">
                    Booking was cancelled by {booking.cancelledBy === "you" ? "you" : "guest"}
                  </p>
                  <p className="font-semibold">{formatDateTime(booking.end)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-blue-500">
                    {booking.status === "completed" ? "Guest returned at" : "Guest shall return by"}
                  </p>
                  <p className="font-semibold">{formatDateTime(booking.end)}</p>
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
              <p className="font-semibold">{formatDateTime(booking.start)}</p>
            </div>
            <ArrowRight className="mt-4" />
            <div>
              <p className="text-sm text-blue-500">To</p>
              <p className="font-semibold">{formatDateTime(booking.end)}</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200" />
          <div>
            <p className="text-sm text-blue-500 mb-1">Booked by</p>
            <p className="font-semibold">{booking.bookedBy.name}</p>
            <p className="text-sm">{booking.bookedBy.contact}</p>
          </div>
          
      </div>
      <div className=" flex justify-center space-x-2 mt-2" onClick={handleClick}>
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
      </div>
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

