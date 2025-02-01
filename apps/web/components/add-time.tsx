'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'

export default function AddTime({
  onTimeSelect,
  className,
  currTime
}: {
  onTimeSelect: (time: string) => void;
  className?: string;
  currTime?:string
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState(currTime || '00:00')


  const generateTimeIntervals = () => {
    const intervals = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        intervals.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        )
      }
    }
    return intervals
  }

  return (
    <div className="relative" >
      <Popover onOpenChange={(open) => setIsPopoverOpen(open)}>
        <PopoverTrigger asChild >
          <div
            className={cn(
              "p-1 w-[60px] text-sm m-0 border-0 focus-visible:ring-0 border-y-4 cursor-text bg-gray-200 rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
              isPopoverOpen ? "border-t-gray-200 hover:border-t-gray-300 border-b-blue-400" : " border-gray-200 hover:border-gray-300",
            )}>
            {selectedTime}
          </div>
        </PopoverTrigger>
      <PopoverContent className=" max-h-40 p-1 overflow-scroll flex flex-col items-center w-24 overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
          onClick={() => setIsPopoverOpen(false)}>
              {generateTimeIntervals().map((time) => (
                <div
                  key={time}
                  className="w-full text-sm cursor-pointer hover:bg-gray-200 rounded-md justify-start p-1 px-4 text-black"
                  onClick={() =>{ 
                    setSelectedTime(time)}}
                >
                  {time}
                </div>
              ))}
      </PopoverContent>
      </Popover>
    </div>
  )
}