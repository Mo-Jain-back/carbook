"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation";
import CarFrontIcon from "@/public/car-front.svg";
import UserIcon from "@/public/user.svg"

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
                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
              )}
            </div>
            {user.isLoggedIn && (
              <button
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white dark:text-black rounded-full shadow-lg"
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
                <h2 className="text-2xl font-bold ">{user.name}</h2>
            
              </div>
              <Button variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent" onClick={() => setUser({ ...user, isLoggedIn: false })}>
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button  className="w-full bg-blue-600 text-white dark:text-black" onClick={() => setUser({ ...user, isLoggedIn: true })}>
                Login
              </Button>
            </div>
          )}
        </div>
        <div>
          {user.isLoggedIn &&
          <Card className="overflow-hidden bg-muted dark:border-gray-700 hover:shadow-md transition-shadow my-2">
            <CardContent className="p-4 text-black dark:text-gray-400">
              <div 
                className="flex items-center justify-between p-2 cursor-pointer dark:hover:bg-gray-700 rounded-md hover:bg-gray-200"
                onClick={() => router.push("/profile/manage-garrage")}>
                <div className="flex items-center" >
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full text-green-700 dark:text-green-500  bg-blue-200 dark:bg-gray-900">
                    <CarFrontIcon  className="w-5 h-4 fill-green-700 stroke-green-700 dark:fill-green-500 dark:stroke-green-500 stroke-[10px]"/>
                  </span>
                  <span className="mx-2 max-sm:text-sm">Manage Garrage</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-black dark:border-gray-400"></div>
              </div>
              <div className="flex items-center justify-between p-2 cursor-pointer dark:hover:bg-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => router.push("/profile/edit")}>
                <div className="flex items-center">
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full text-green-700 dark:text-green-500  bg-blue-200 dark:bg-gray-900">
                    <UserIcon  className="w-5 h-5 stroke-[12px] stroke-green-700 dark:stroke-green-500 fill-green-700 dark:fill-green-500 "/>
                  </span>
                  <span className="mx-2 max-sm:text-sm">Manage Profile</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-black dark:border-gray-400"></div>
              </div>
              
            </CardContent>
          </Card>
          }
        </div>
      </main>
    </div>
  )
}

