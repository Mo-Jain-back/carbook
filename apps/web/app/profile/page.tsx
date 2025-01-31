"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Car, CarTaxiFrontIcon, Edit, Pencil, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// This would typically come from your auth system
const mockUser = {
  isLoggedIn: true,
  name: "John Doe",
  image: null, // or URL to image
}

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image src={user.image || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              ) : (
                <User className="w-16 h-16 text-black" />
              )}
            </div>
            {user.isLoggedIn && (
              <button
                className="absolute bottom-0 right-0 p-2 bg-black text-blue-100 hover:bg-blue-100 hover:border hover:border-black hover:text-black rounded-full shadow-lg"
                onClick={() => {
                  /* Handle image edit */
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>

          {user.isLoggedIn ? (
            <>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <button
                  className="p-1.5 text-blue-500 hover:text-black"
                  onClick={() => {
                    /* Handle name edit */
                  }}
                >
           
                </button>
              </div>
              <Button variant="outline" className="hover:bg-black hover:text-blue-100" onClick={() => setUser({ ...user, isLoggedIn: false })}>
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button  className="w-full bg-black text-blue-100 hover:bg-blue-100 hover:border hover:border-black hover:text-black" onClick={() => setUser({ ...user, isLoggedIn: true })}>
                Login
              </Button>
            </div>
          )}
        </div>
        <div>
          <Card className="overflow-hidden hover:shadow-md transition-shadow my-2">
            <CardContent className="p-4 text-black">
              <div className="flex items-center justify-between p-2 cursor-pointer">
                <div className="flex">
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full bg-blue-100">
                    <CarTaxiFrontIcon color={"green"} className="w-5 h-5 "/>
                  </span>
                  <span className="mx-2">View Cars</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 w-2 h-2 border-black"></div>
              </div>
              <div className="flex items-center justify-between p-2 cursor-pointer"
              onClick={() => router.push("/edit-profile")}>
                <div className="flex">
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full bg-blue-100">
                    <User color={"green"} className="w-5 h-5 "/>
                  </span>
                  <span className="mx-2">View Profile Details</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 w-2 h-2 border-black"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

