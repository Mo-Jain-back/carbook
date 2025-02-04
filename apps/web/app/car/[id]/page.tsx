import { NavBar } from "@/components/navbar"
import { BottomNav } from "@/components/bottom-nav"
import { Suspense } from "react"
import { CarDetailsClient } from "@/components/car-details-client";
import LoadingScreen from "@/components/loading-screen";

// This would typically come from a database or API
const userCars = [
  {
    id: 1,
    brand: "Tesla",
    model:" Model 3",
    plateNumber: "ABC 123",
    color:"green",
    imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=1200",
    mileage:"320",
    price:"150",
    bookings: [
      {
        id: 101,
        start: "2024-01-25T10:00:00",
        end: "2024-01-27T18:00:00",
        bookedBy: { name: "John Doe", contact: "+1234567890" },
        status: "upcoming",
        cancelledBy: null,
      },
      {
        id: 102,
        start: "2024-02-10T09:00:00",
        end: "2024-02-15T17:00:00",
        bookedBy: { name: "Jane Smith", contact: "+1987654321" },
        status: "cancelled",
        cancelledBy: "guest",
      },
    ],
  },
  {
    id: 2,
    brand: "Ford",
    model:" Mustang",
    color:"blue",
    plateNumber: "XYZ 789",
    imageUrl: "https://platform.cstatic-images.com/in/v2/stock_photos/602375aa-858e-4b71-a9eb-f77ca929c9d0/2fb5b283-ca73-41c1-812d-151a80af3953.png",
    mileage: "320",
    price: "150",
    bookings: [
      {
        id: 201,
        start: "2024-01-28T11:00:00",
        end: "2024-01-30T16:00:00",
        bookedBy: { name: "Alice Johnson", contact: "+1122334455" },
        status: "ongoing",
        cancelledBy: null,
      },
      {
        id: 202,
        start: "2024-02-20T08:00:00",
        end: "2024-02-25T19:00:00",
        bookedBy: { name: "Bob Williams", contact: "+1555666777" },
        status: "completed",
        cancelledBy: null,
      },
    ],
  },
]



export default async function CarDetails({ params }: { params: { id: string } }) {
  const carId = await Number(params.id); // Resolve params.id synchronously after awaiting params

  const car = userCars
    .find((b) => b.id === carId);

  if (!car) {
    return <div>Car not found</div>
  }


  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto w-full px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <CarDetailsClient car={car}  />
        </Suspense>
      </main>
    </div>
  )
}
