"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "../public/jcr logo design 2.png"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()

  const isHomePage = pathname === "/"

  return (
    <nav className="flex items-center justify-between px-4 py-[3px] bg-[#039BE5] text-primary-foreground">
      <div className="w-18 flex sm:hidden items-center">
        {!isHomePage && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:text-black hover:bg-white sm:hidden"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
      </div>
      <Link href="/" className="flex-grow flex justify-center sm:justify-start">
        <Image
          src={logo || "/placeholder.svg"}
          alt={"JCR"}
          style={{ objectFit: "cover" }}
          className="w-28 sm:rounded-l-lg sm:rounded-t-none"
        />
      </Link>
      <div className="w-18 space-x-2  text-right">
        <Button
          variant="secondary"
          className="bg-black hover:bg-blue-500 hidden sm:block hover:border hover:border-black hover:text-black text-white"
          asChild
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

