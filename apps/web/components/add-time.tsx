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
  setSelectedTime,
  className,
  selectedTime
}: {
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  selectedTime:string
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

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
              "p-1 sm:w-[60px] sm:text-sm text-xs m-0 h-[36px] p-[6px] border-0 focus-visible:ring-0 border-transparent border-y-4 cursor-text bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
              isPopoverOpen ? "border-b-blue-400" : " ",
            )}>
            {selectedTime}
          </div>
        </PopoverTrigger>
      <PopoverContent className=" max-h-40 p-1 dark:border-muted overflow-scroll flex flex-col items-center w-24 overflow-x-hidden rounded-md border bg-popover dark:bg-gray-800 text-popover-foreground shadow-md"
          onClick={() => setIsPopoverOpen(false)}
          style={{ pointerEvents: "auto" }} >
              {generateTimeIntervals().map((time) => (
                <div
                  key={time}
                  className="w-full sm:text-sm text-xs cursor-pointer dark:hover:bg-card rounded-md justify-start p-1 px-4"
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