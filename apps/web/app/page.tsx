import Link from "next/link"
import { AddCarDialog } from "@/components/add-car"
import StarryBackground from "@/components/starry-background"
import ThemeBg from "@/components/theme-bg";


export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <section className="dark:bg-black bg-white relative overflow-hidden py-14">
          
          {/* <RayBg className="absolute top-0 left-0 dark:w-0 transition-all duration-300 h-full"/> */}
          
          {/* Background Components */}
          <div className="absolute inset-0 -z-1">
            <StarryBackground />
            <ThemeBg />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <h1 className="sm:text-4xl text-2xl font-bold [text-shadow:_0_8px_8px_rgb(103_103_110_/_0.8)] text-gray-900 dark:text-gray-200 mb-4"
                  style={{ fontFamily: "var(--font-alma), sans-serif" }}>
                SEAMLESS CAR BOOKINGS
              </h1>
              <p className="sm:text-xl text-sm text-muted-foreground mb-8">
                Manage your car rentals with ease using our intuitive booking scheduler.
              </p>
              <Link
                href="/bookings"
                className="bg-primary max-sm:text-sm text-primary-foreground px-3 sm:px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition duration-300"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </section>
        <div className="-z-2">
          <AddCarDialog/>
        </div>

        <section className="bg-[#4b6196] text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="sm:text-3xl text-xl font-bold mb-4">Ready to streamline your car rentals?</h2>
            <p className="text-xl max-sm:text-sm mb-8">Join Us today and experience hassle-free booking management.</p>
            <Link
              href="/booking"
              className="bg-card max-sm:text-sm text-card-foreground px-3 sm:px-6 py-3 rounded-md font-semibold hover:bg-muted transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Jain Car Rental. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

