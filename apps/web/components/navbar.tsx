"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo1 from "../public/logo1.svg"
import LogoText from "../public/logo_text.svg"
import { usePathname, useRouter } from "next/navigation"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()


  return (
    <nav className="flex items-center rounded-none cursor-normal bg-gray-100 justify-between px-4 py-[6px] text-primary-foreground">
      <div className="max-sm:w-25 flex sm:hidden items-center">
      <span className="h-6 w-6 px-5 mr-[6px]"></span>
      </div>
      <Link href="/" className={`flex-grow rounded-none flex sm:ml-4 justify-center items-center sm:justify-start`}>
        <div className="flex items-start">
          <Logo1 className="h-[55px] fill-[#039BE5] stroke-[1px]"/>
        </div>
        <LogoText className="ml-[-5px] w-18 h-9"/> 
      </Link>
      <div className="w-18 space-x-2  flex text-right items-center">
        <div className="flex items-center text-gray-700 max-sm:hidden space-x-2 justify-around">
          <div className="px-2 hover:text-blue-800 border-transparent transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/')}>Home</div>
          <div className="px-2 hover:text-blue-800 border-transparent transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/bookings')}>Bookings</div>
          <div className="px-2 hover:text-blue-800 border-transparent transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/bookings')}> Calendar</div>
          <div className="px-2 hover:text-blue-800 border-transparent transition-all border duration-300 border-y-4 hover:border-b-blue-800 p-2 cursor-pointer font-bold" 
                onClick={() => router.push('/profile')}> Profile</div>
        </div>
        <span className="h-6 w-6 px-5 mr-[6px] max-sm:block hidden"></span>
        <Button
          variant="secondary"
          className="bg-black hover:bg-blue-500 hidden sm:block border border-black hover:text-black text-white"
          asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

