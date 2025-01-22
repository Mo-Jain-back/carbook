import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function Bookings() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <div className="space-y-4">
          {userCars.map((car) => (
            <Card key={car.id}>
              <CardHeader>
                <CardTitle>{car.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {car.bookings.map((booking, index) => (
                  <div key={index} className="mb-2">
                    <p>From: {booking.start}</p>
                    <p>To: {booking.end}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

