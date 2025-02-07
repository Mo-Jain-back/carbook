"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo1 from "@/public/logo1.svg"
import LogoText from "@/public/logo_text.svg"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"

export function NavBar() {
  const [selectedTab, setSelectedTab] = useState("home")
  const pathname = usePathname()
  const router = useRouter()

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
 
    <nav className="fixed w-full dark:border-b-muted border-b-[1px] top-0 left-0 z-[99999] flex items-center rounded-none cursor-normal bg-gray-100 dark:bg-black justify-between px-4 py-[6px] text-primary-foreground">
      <div className="max-sm:w-25 flex sm:hidden items-center">
        <span className="h-6 w-6 px-5 mr-[6px]"></span>
      </div>
      <Link href="/" className={`flex-grow rounded-none flex sm:ml-4 justify-center items-center sm:justify-start`}>
        <div className="flex items-start">
          <Logo1 className="h-[50px] fill-[#039BE5] stroke-[1px]"/>
        </div>
        <LogoText className="ml-[-5px] dark:stroke-white w-14 h-7"/> 
      </Link>
      <div className="sm:w-full sm:ml-48 flex justify-center items-center">
          <ThemeToggle />
      </div>
      <div className="w-18 space-x-2  flex text-right items-center">
        <div className="flex items-center text-gray-700 dark:text-gray-200 max-sm:hidden space-x-2 justify-around">
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "home" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/')}>Home</div>
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "bookings" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/bookings')}>Bookings</div>
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "calendar" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/calendar')}> Calendar</div>
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "profile" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/profile')}> Profile</div>
        </div>
        
      </div>
    </nav>
    <div className="w-full h-[60px]"></div>
         
    </div>
  )
}

