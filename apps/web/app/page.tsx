import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

// This would typically come from a database or API
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
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">My Cars</h1>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4 text-blue-100" />
            <span className="text-blue-100">Add Car</span> 
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
      </main>
      <BottomNav />
    </div>
  )
}

