import Image from "next/image"


interface CarCardProps {
  name: string
  imageUrl: string
}

export function CarCard({ name, imageUrl }: CarCardProps) {
  return (
    <div  className="w-full z-0 " style={{zIndex:-9999}} >
      <div style={{zIndex:-9999}} className="p-2 border border-gray-200 z-0 dark:border-gray-700 bg-blue-100 dark:bg-gray-900 rounded-md cursor-pointer">
        <div style={{zIndex:-9999}} className="flex sm:flex-col flex-row  justify-around sm:px-1 px-8">
          <div className="relative sm:w-full w-2/3 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg  "
            />
          </div>
          <div className="p-4 w-full flex  sm:justify-center justify-end items">
            <h3 className="text-lg max-sm:text-sm font-semibold ">{name}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

