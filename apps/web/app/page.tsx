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
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-01", end: "2023-06-03" },
      { start: "2023-06-10", end: "2023-06-15" },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-05", end: "2023-06-07" },
      { start: "2023-06-20", end: "2023-06-25" },
    ],
  },
  {
    id: 3,
    name: "Toyota Camry",
    imageUrl: "/placeholder.svg?height=200&width=300",
    bookings: [
      { start: "2023-06-08", end: "2023-06-09" },
      { start: "2023-06-18", end: "2023-06-22" },
    ],
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Cars</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Car
          </Button>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCars.map((car) => (
            <Link href={`/car/${car.id}`} key={car.id}>
              <CarCard name={car.name} imageUrl={car.imageUrl} />
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

