"use client"
import { Suspense, use, useEffect, useState } from "react"
import { BookingDetailsClient } from "./booking-details-client"
import LoadingScreen from "@/components/loading-screen"
import BookingNotFound from "@/components/booking-not-found"
import { useParams } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/lib/config"

export interface Booking {
  id: number;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerContact: string;
  carId:number;
  carName: string;
  carPlateNumber: string;
  carImageUrl: string;
  dailyRentalPrice: number;
  securityDeposit?: string;
  totalPrice?: number;
  advancePayment?: number;
  customerAddress?: string;
  paymentMethod?: string;
  drivingLicence?: string;
  aadharCard?: string;
  odometerReading?: string;
  notes?: string;
}

export default function BookingDetails() {
  // const bookingId = await Number(params.id); // Resolve params.id synchronously after awaiting params
  const Booking =  useParams(); 
  const [booking,setBooking] = useState<Booking>(); 
  useEffect(() => {
    if (!Booking) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/booking/${Booking.id}`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
          setBooking(res.data.booking);
      }
      catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (!Booking || !booking) {
  return <div><BookingNotFound/></div>
  }

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <BookingDetailsClient booking={booking} setBooking={setBooking} />
        </Suspense>
      </main>
    </div>
  )
}
