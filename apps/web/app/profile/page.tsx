"use client"

import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Pencil, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// This would typically come from your auth system
const mockUser = {
  isLoggedIn: true,
  name: "John Doe",
  image: null, // or URL to image
}

export default function Profile() {
  const [user, setUser] = useState(mockUser)

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image src={user.image || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              ) : (
                <User className="w-16 h-16 text-blue-400" />
              )}
            </div>
            {user.isLoggedIn && (
              <button
                className="absolute bottom-0 right-0 p-2 bg-blue-500 text-primary-foreground rounded-full shadow-lg"
                onClick={() => {
                  /* Handle image edit */
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>

          {user.isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <button
                  className="p-1.5 text-blue-500 hover:text-foreground"
                  onClick={() => {
                    /* Handle name edit */
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <Button variant="outline" className="hover:bg-blue-100 text-black" onClick={() => setUser({ ...user, isLoggedIn: false })}>
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button  className="w-full hover:bg-blue-100 text-black" onClick={() => setUser({ ...user, isLoggedIn: true })}>
                Login
              </Button>
              <Button variant="outline" >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

