import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface CarCardProps {
  name: string
  imageUrl: string
}

export function CarCard({ name, imageUrl }: CarCardProps) {
  return (
    <div className="w-full z-[-10]">
      <div className="p-2 border-black bg-blue-100 rounded-md cursor-pointer">
        <div className="flex sm:flex-col flex-row justify-around sm:px-1 px-8">
          <div className="relative sm:w-full w-2/3 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg  "
            />
          </div>
          <div className="p-4 w-full flex sm:justify-center justify-end items">
            <h3 className="text-lg font-semibold text-black">{name}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

