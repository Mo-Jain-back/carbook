"use client"
import { Suspense, use, useEffect, useState } from "react"
import LoadingScreen from "@/components/loading-screen"
import BookingNotFound from "@/components/booking-not-found"
import { useParams } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import BookingStartClient from "./booking-start-client"

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

  if(!Booking) return null

  if (!booking) {
  return <div><LoadingScreen/></div>
  }

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <BookingStartClient booking={booking} bookingId={Booking?.id || ""}  />
        </Suspense>
      </main>
    </div>
  )
}
