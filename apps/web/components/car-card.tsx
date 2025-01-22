import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface CarCardProps {
  name: string
  imageUrl: string
}

export function CarCard({ name, imageUrl }: CarCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-2 cursor-pointer">
        <div className="flex sm:flex-col flex-row">
          <div className="relative sm:w-full w-1/3 sm:h-48 h-full">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
            />
          </div>
          <div className="p-4 w-full flex sm:justify-center justify-end items">
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

