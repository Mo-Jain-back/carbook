import Image from "next/image"


interface CarCardProps {
  name: string
  imageUrl: string,
  plateNumber:string,
  color:string
}

export function CarCard({ name, imageUrl,plateNumber,color }: CarCardProps) {
  return (
    <div  className="w-full z-0 relative z-0" >
      <div className="p-2 border border-border shadow-md z-0  bg-gray-200 dark:bg-background rounded-md cursor-pointer">
        <div className="flex sm:flex-col flex-row  justify-between sm:px-1 px-3">
          <div className="relative sm:w-full w-2/3 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg  "
            />
          </div>
          <div className="p-4 w-full flex sm:justify-center justify-end items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-lg max-sm:text-sm font-semibold ">{name}</h3>
                <span className="sm:text-sm text-xs">{plateNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

