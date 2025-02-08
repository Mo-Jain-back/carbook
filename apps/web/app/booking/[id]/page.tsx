"use client"
import { Suspense, useEffect, useState } from "react"
import { BookingDetailsClient } from "./booking-details-client"
import LoadingScreen from "@/components/loading-screen"
import BookingNotFound from "@/components/booking-not-found"
import { useParams } from "next/navigation"

interface Booking {
  car: {
      id: number;
      name: string;
      plateNumber: string;
      imageUrl: string;
  };
  id: number;
  start: string;
  end: string;
  bookedBy: {
      name: string;
      contact: string;
  };
  status: string;
  cancelledBy: string |null;
}
// This would typically come from a database or API
const userCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    plateNumber: "ABC 123",
    imageUrl: "",
    bookings: [
      {
        id: 101,
        start: "2024-01-25T10:00:00",
        end: "2024-01-27T18:00:00",
        bookedBy: { name: "John Doe", contact: "+1234567890" },
        status: "Upcoming",
        cancelledBy: null,
      },
      {
        id: 102,
        start: "2024-02-10T09:00:00",
        end: "2024-02-15T17:00:00",
        bookedBy: { name: "Jane Smith", contact: "+1987654321" },
        status: "Cancelled",
        cancelledBy: "guest",
      },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    plateNumber: "XYZ 789",
    imageUrl: "",
    bookings: [
      {
        id: 201,
        start: "2024-01-28T11:00:00",
        end: "2024-01-30T16:00:00",
        bookedBy: { name: "Alice Johnson", contact: "+1122334455" },
        status: "Ongoing",
        cancelledBy: null,
      },
      {
        id: 202,
        start: "2024-02-20T08:00:00",
        end: "2024-02-25T19:00:00",
        bookedBy: { name: "Bob Williams", contact: "+1555666777" },
        status: "Completed",
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

export default function BookingDetails() {
  // const bookingId = await Number(params.id); // Resolve params.id synchronously after awaiting params
  const Booking =  useParams();
  const [booking, setBooking] = useState<Booking>();

  useEffect(() => {
    if(!Booking?.id) return;
    async function fetchData() {
      try {
        const filteredBooking = userCars
          .flatMap((car) =>
            car.bookings.map((booking) => ({
              ...booking,
              car: {
                id: car.id,
                name: car.name,
                plateNumber: car.plateNumber,
                imageUrl: car.imageUrl ,
              },
            })),
          )
          .find((b) => b.id === Number(Booking?.id))
        
        setBooking(filteredBooking);
      }
      catch (error) {
        console.log(error);
      }
    }
    
    fetchData();
    
  }, [Booking]);

  if (!booking) {
  return <div><BookingNotFound/></div>
  }

  const status = getBookingStatus(booking.start, booking.end)

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <BookingDetailsClient booking={booking} />
        </Suspense>
      </main>
    </div>
  )
}
