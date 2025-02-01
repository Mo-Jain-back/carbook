"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "../public/jcr3.png"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()

  const isHomePage = pathname === "/"

  return (
    <nav className="flex items-center cursor-normal justify-between px-4 py-[3px] bg-[#039BE5] text-primary-foreground">
      <div className="max-sm:w-25 flex sm:hidden items-center">
        {!isHomePage ? (
          <div
            className="mr-2 p-2 rounded-md font-bold text-white hover:text-black hover:bg-white sm:hidden"
            onClick={() => router.back()} 
          >
            <ArrowLeft className="h-6 w-6" />
          </div>
        )
        :
        <span className="h-6 w-6 px-5 mr-[6px]"></span>
      }
      </div>
      <Link href="/" className={`flex-grow flex max-w-16 justify-center sm:justify-start`}>
        <Image
          src={logo || "/placeholder.svg"}
          alt={"JCR"}
          style={{ objectFit: "cover" }}
          className=" sm:rounded-l-lg sm:rounded-t-none"
        />
      </Link>
      <div className="w-18 space-x-2  flex text-right items-center">
        <div className="flex items-center max-sm:hidden space-x-2 justify-around">
          <div className="px-2 hover:text-blue-800 border-[#039BE5] transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/')}>Home</div>
          <div className="px-2 hover:text-blue-800 border-[#039BE5] transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/bookings')}>Bookings</div>
          <div className="px-2 hover:text-blue-800 border-[#039BE5] transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/bookings')}> Calendar</div>
          <div className="px-2 hover:text-blue-800 border-[#039BE5] transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/profile')}> Profile</div>
        </div>
        <span className="h-6 w-6 px-5 mr-[6px] max-sm:block hidden"></span>
        <Button
          variant="secondary"
          className="bg-black hover:bg-blue-500 hidden sm:block hover:border hover:border-black hover:text-black text-white"
          asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

