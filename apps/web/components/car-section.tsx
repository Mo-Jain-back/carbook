"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {   PlusSquare } from "lucide-react"
import { CarCard } from "./car-card"
import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import axios from "axios"
import LoadingScreen from "./loading-screen"
import { AddCarDialog } from "./add-car"
import { Car, useCarStore } from "@/lib/store"


export function CarSection() {
  const [isOpen,setIsOpen] = useState(false);
  const {cars} = useCarStore();

  if(!cars) {
    return <LoadingScreen/>;
  }

  return (
    <>
    <AddCarDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        <section className="py-6 bg-muted px-4">
            <div className="flex justify-between items-center mb-8 px-4">
                <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                 }} className="sm:text-3xl text-xl font-black font-myfont">MOHIT's GARRAGE</h1>
                <Button className="bg-blue-600 text-white dark:text-black hover:bg-opacity-80  shadow-lg"
                  onClick={() => setIsOpen(true)}>
                  <PlusSquare className="text-20 h-12 w-12" />
                  <span className="">Add Car</span> 
                </Button>
            </div>
            <div style={{zIndex:-9999}} className="grid z-0 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                <Link
                    href={`/car/${car.id}`}
                    key={car.id}
                    className="transform transition-all z-0 duration-300 hover:scale-105"
                >
                    <CarCard name={car.brand + " " + car.model} imageUrl={car.imageUrl} />
                </Link>
                ))}
            </div>
        </section>
    </>
  )
}