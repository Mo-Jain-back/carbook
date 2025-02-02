import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle } from "lucide-react"
import { AddCarDialog } from "@/components/add-car"




export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <section className="bg-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-alcova), sans-serif",
                 }}>Seamless Car Bookings</h1>
              <p className="text-xl text-gray-600 mb-8" >
                Manage your car rentals with ease using our intuitive booking scheduler.
              </p>
              <Link
                href="/bookings"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </section>

        <AddCarDialog/>

        <section className="bg-blue-500 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to streamline your car rentals?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join CarScheduler today and experience hassle-free booking management.
            </p>
            <Link
              href="/booking"
              className="bg-white text-blue-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 CarScheduler. All rights reserved.</p>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}

