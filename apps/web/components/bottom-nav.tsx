"use client"

import Link from "next/link"
import { Home, Calendar, User } from "lucide-react";
import AppointmentIcon from "../public/pending-appointment.svg"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function BottomNav() {
  const [selectedTab, setSelectedTab] = useState("home")
  const pathname = usePathname()

  useEffect(() => {
    console.log("pathname",pathname)
    if (pathname.startsWith("/bookings")) {
      setSelectedTab("bookings")
    } else if (pathname.startsWith("/profile")) {
      setSelectedTab("profile")
    } else if (pathname.startsWith("/calendar")) {
      setSelectedTab("calendar")
    } else if (pathname === "/"){
      setSelectedTab("home")
    }
  }, [pathname])

  return (
    <div className="relative">
      <div className="w-full h-[56px] sm:hidden"></div>
      <nav className="fixed z-[99999] bottom-0 left-0 right-0 bg-gray-600 dark:bg-[#141414] text-primary-foreground sm:hidden">
        <div className="flex justify-around py-2">
          <Link href="/" className={`flex flex-col items-center ${selectedTab=="home" ? "text-primary" : "text-white"} hover:text-primary`}>
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/bookings" className={`flex flex-col items-center ${selectedTab=="bookings" ? "text-primary" : "text-white"} hover:text-primary`}>
          <span color="white" className=" flex flex-col items-center">
            <AppointmentIcon className="w-6 h-6 "/>
            <span className="text-xs">Bookings</span>
          </span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center ${selectedTab=="profile" ? "text-primary" : "text-white"} hover:text-primary`}>
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
      
    </div>
  )
}

