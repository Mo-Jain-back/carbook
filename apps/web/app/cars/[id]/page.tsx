"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

// Dummy data for the car
const carData = {
  id: "1",
  brand: "Tesla",
  model: "Model 3",
  color: "Midnight Silver",
  number: "ABC 123",
  price: 150,
  mileage: 320,
  image: "/placeholder.svg?height=400&width=600",
}

export default function CarDetails() {
  const [car, setCar] = useState(carData)

  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Delete car:", car.id)
  }

  const handleEditPhoto = () => {
    // Implement photo edit functionality here
    console.log("Edit photo for car:", car.id)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <Image
            src={car.image || "/placeholder.svg"}
            alt={`${car.brand} ${car.model}`}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={handleEditPhoto}
            className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            <Edit size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/cars" className="flex items-center text-primary hover:text-primary/90 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Cars
            </Link>
            <button onClick={handleDelete} className="text-destructive hover:text-destructive/90 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            {car.brand} {car.model}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Car Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Brand:</span> {car.brand}
                </p>
                <p>
                  <span className="font-medium">Model:</span> {car.model}
                </p>
                <p>
                  <span className="font-medium">Color:</span> {car.color}
                </p>
                <p>
                  <span className="font-medium">Number:</span> {car.number}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Performance & Pricing</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">24hr Price:</span> ${car.price}
                </p>
                <p>
                  <span className="font-medium">Mileage:</span> {car.mileage} miles/charge
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

