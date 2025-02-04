"use client"

import Link from "next/link"
import { Home, Calendar, User } from "lucide-react";
import AppointmentIcon from "../public/pending-appointment.svg"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-600 text-primary-foreground sm:hidden">
      <div className="flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center text-white hover:text-[#039BE5]">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/bookings" className="flex flex-col items-center">
        <span color="white" className="text-white hover:text-[#039BE5] flex flex-col items-center">
          <AppointmentIcon className="w-6 h-6 "/>
          <span className="text-xs">Bookings</span>
        </span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-white hover:text-[#039BE5]">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

