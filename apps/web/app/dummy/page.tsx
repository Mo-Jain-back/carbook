import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const userCars = [
    {
      id: 1,
      name: "Tesla Model 3",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=1200",
      bookings: [
        { start: "2023-06-01", end: "2023-06-03" },
        { start: "2023-06-10", end: "2023-06-15" },
      ],
    },
    {
      id: 2,
      name: "Ford Mustang",
      imageUrl: "https://platform.cstatic-images.com/in/v2/stock_photos/602375aa-858e-4b71-a9eb-f77ca929c9d0/2fb5b283-ca73-41c1-812d-151a80af3953.png",
      bookings: [
        { start: "2023-06-05", end: "2023-06-07" },
        { start: "2023-06-20", end: "2023-06-25" },
      ],
    },
    {
      id: 3,
      name: "Toyota Camry",
      imageUrl: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg",
      bookings: [
        { start: "2023-06-08", end: "2023-06-09" },
        { start: "2023-06-18", end: "2023-06-22" },
      ],
    },
  ]


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Effortless Car Rental Scheduling</h1>
              <p className="text-xl text-gray-600 mb-8">
                Manage your car rentals with ease using our intuitive booking scheduler.
              </p>
              <Link
                href="/booking"
                className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                Start Booking Now
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
            <div className="w-full px-4 py-4 rounded-sm bg-black bg-opacity-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">My Garrage</h1>
                <Button className="bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4 " />
                <span className="">Add Car</span> 
                </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map((car) => (
                <Link
                    href={`/car/${car.id}`}
                    key={car.id}
                    className="transform transition-all duration-300 hover:scale-105"
                >
                    <CarCard name={car.name} imageUrl={car.imageUrl} />
                </Link>
                ))}
            </div>
            </div>
        </section>

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

