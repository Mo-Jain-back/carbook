"use client"

import {useEffect, useState} from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dayjs } from "dayjs"
import { Input } from "./input"

export function StatusInput({status,setStatus,className}:
  {
    status:String,
    setStatus:React.Dispatch<React.SetStateAction<string>>,
    className?:string
  }) 
  {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const statusOptions = ["Upcoming","Ongoing","Completed","Cancelled"]

 
  return (
    <div>
      <Popover onOpenChange={(open) => setIsPopoverOpen(open)}>
        <PopoverTrigger asChild>
          <div
          className={cn(
              "p-1 w-[110px] m-0 border-0 text-sm focus-visible:ring-0 border-y-4 border-transparent cursor-pointer bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
              isPopoverOpen ? "border-b-blue-400" : "",
            )}
          >
            {status}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-[8px] border-border" align="start">
          <div key={"option"}>
            {statusOptions.map((option,index) => {
              return (
                <div key={index}
                className="p-1 cursor-pointer text-sm rounded-md hover:bg-muted dark:hover:bg-card"
                onClick={() => {
                  setStatus(option);
                }}
                >{option}</div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}