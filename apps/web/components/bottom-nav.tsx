"use client"

import Link from "next/link"
import { Home } from "lucide-react";
import Booking from "@/public/online-booking.svg"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import UserIcon from "@/public/user.svg";
import Calendar from "@/public/calendar.svg"

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
      <nav className="fixed z-[99999] bottom-0 left-0 right-0 bg-blue-300 dark:bg-[#141414] text-primary-foreground sm:hidden">
        <div className="flex justify-around py-2">
          <Link href="/" className={`flex flex-col items-center ${selectedTab=="home" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <Home className="h-6 w-6" />
            <span className="text-xs font-bold">Home</span>
          </Link>
          <Link href="/bookings" className={`flex flex-col items-center ${selectedTab=="bookings" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <span color="white" className=" flex flex-col items-center">
              <Booking className={`h-6 w-6 ${selectedTab=="bookings" ? "fill-[#27272A] stroke-[#27272A] dark:fill-primary dark:stroke-primary" : "fill-white stroke-white"} stroke-[5px] hover:fill-[#27272A] hover:stroke-[#27272A] dark:hover:fill-primary dark:hover:stroke-primary`}/>
              <span className="text-xs font-bold">Bookings</span>
            </span>
          </Link>
          <Link href="/calendar" className={`flex flex-col items-center ${selectedTab=="calendar" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <span color="white" className=" flex flex-col items-center">
              <Calendar className={`h-6 w-6 ${selectedTab=="calendar" ? "fill-[#27272A] stroke-[#27272A] dark:fill-primary dark:stroke-primary" : "fill-white stroke-white"} stroke-[6px] hover:fill-[#27272A] hover:stroke-[#27272A] dark:hover:fill-primary dark:hover:stroke-primary`}/>
              <span className="text-xs font-bold">Calendar</span>
            </span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center ${selectedTab=="profile" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <UserIcon className={`h-6 w-6 ${selectedTab=="profile" ? "fill-[#27272A] stroke-[#27272A] dark:fill-primary dark:stroke-primary" : "fill-white stroke-white"} stroke-[18px] hover:fill-[#27272A] hover:stroke-[#27272A] dark:hover:fill-primary dark:hover:stroke-primary`} />
            <span className="text-xs font-bold">Profile</span>
          </Link>
        </div>
      </nav>
      
    </div>
  )
}

