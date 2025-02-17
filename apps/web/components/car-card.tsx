import Image from "next/image";
import Ashoka from "@/public/ashoke-chakra.svg";


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
          <div className="relative flex-shrink-0 sm:w-full w-1/2 h-24 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg  "
            />
          </div>
          <div className="sm:p-4 w-full flex sm:justify-center justify-end items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-lg max-sm:text-sm font-semibold ">{name}</h3>
                <div className="flex justify-center -mt-3 items-center gap-1 p-1 border-[3.5px] scale-[0.5] border-black dark:border-white rounded-sm">
                  <div className="flex flex-col items-center justify-between">
                    <Ashoka className="h-2 w-2 stroke-blue-300 stroke-[7px] fill-blue-300" />
                    <span className="h-full text-[0.001px] text-blue-300">IND</span>
                  </div>
                  <span className="text-3xl whitespace-nowrap font-extrabold ">
                    {plateNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

