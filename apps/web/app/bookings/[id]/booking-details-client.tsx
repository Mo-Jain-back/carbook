"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface BookingDetailsClientProps {
  booking: {
    id: number
    start: string
    end: string
    car: {
      name: string
      plateNumber: string
      imageUrl: string
    }
    bookedBy: {
      name: string
      contact: string
    }
  }
  status: string
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

export function BookingDetailsClient({ booking, status }: BookingDetailsClientProps) {
  const router = useRouter()

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => router.back()} className="text-primary">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold">{status}</h2>
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {status === "Booking Completed" ? "Guest returned at" : "Guest shall return by"}
              </p>
              <p className="font-semibold">{formatDateTime(booking.end)}</p>
            </div>
            <div className="text-right">
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          <div className="flex items-center gap-8 mb-4">
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
          <hr className="my-4 border-gray-200" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Booked by</p>
            <p className="font-semibold">{booking.bookedBy.name}</p>
            <p className="text-sm">{booking.bookedBy.contact}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

