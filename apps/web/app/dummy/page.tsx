import Link from "next/link"
import { Car } from "lucide-react"
import Calendar from "@/public/calendar.svg"
import { ThemeToggle } from "@/components/theme-toggle"
import UserIcon from "@/public/user.svg"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <main>
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Effortless Car Rental Scheduling</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Manage your car rentals with ease using our intuitive booking scheduler.
              </p>
              <Link
                href="/booking"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition duration-300"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <Car className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-muted-foreground">Book your desired car with just a few clicks.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <Calendar className="w-12 h-12 stroke-primary fill-primary mb-4 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">Visualize all bookings in an intuitive calendar interface.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <UserIcon className="w-12 h-12 stroke-[12px] stroke-primary fill-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">User Profiles</h3>
                <p className="text-muted-foreground">Manage your account and booking history with ease.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your car rentals?</h2>
            <p className="text-xl mb-8">Join CarScheduler today and experience hassle-free booking management.</p>
            <Link
              href="/booking"
              className="bg-card text-card-foreground px-6 py-3 rounded-md font-semibold hover:bg-muted transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 CarScheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

