"use client";

  import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const myCars = [
  { id: "cal1", title: "Tesla Mode 3", color: "accent-red-600" },
  { id: "cal2", title: "Maruti", color: "accent-blue-600" },
  { id: "cal3", title: "Audi", color: "accent-green-600" },
];

type CalendarEventType = {
  id: string;
  title: string;
  car:string;
  startDate: Dayjs;
  endDate: Dayjs;
  description: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
}
type Car = {
  id: string;
  title: string;
  color: string;
}

const allEvents: CalendarEventType[] = [
  {
    id: "event1",
    title: "Event 1",
    car: "cal1",
    startDate: dayjs().add(1, "day"),
    endDate: dayjs().add(2, "day"),
    description: "Event 1 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
  {
    id: "event2",
    title: "Event 2",
    car: "cal2",
    startDate: dayjs().add(2, "day"),
    endDate: dayjs().add(3, "day"),
    description: "Event 2 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
  {
    id: "event3",
    title: "Event 3",
    car: "cal3",
    startDate: dayjs().add(3, "day"),
    endDate: dayjs().add(4, "day"),
    description: "Event 3 description",
    startTime: "12:00",
    endTime: "13:00",
    allDay: false,
  },
];

export default function CarsFilters() {
  const [selectedCars, setSelectedCars] = useState<string[]>(myCars.map(car => car.id));
  const [color, setColor] = useState("#000000")
  const [isOpen, setIsOpen] = useState(false)

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const handleUpdate = () => {
    // Here you would typically update the color in your application state or backend
    console.log("Updating color to:", color)
    setIsOpen(false)
  }
  const handleCheckboxChange = (carId: string) => {
    setSelectedCars((prevSelected) => {
      const newSelection = prevSelected.includes(carId)
        ? prevSelected.filter(id => id !== carId)
        : [...prevSelected, carId];
      
      const filteredEvents = allEvents.filter(event => newSelection.includes(event.car));
      // setEvents(filteredEvents);
      return newSelection;
    });
  };
  return (
    <div>
          {myCars.map((car) => (
            <div className="flex items-center  space-x-3 " key={car.id}>
              <input
                type="checkbox"
                id={car.id}
                checked={selectedCars.includes(car.id)}
                onChange={() => handleCheckboxChange(car.id)}
                className={cn("h-4 w-4 rounded-none", `${car.color}`)}
              />
              <div className="flex items-center justify-between w-full px-[4px]">
                <label
                  htmlFor={car.id}
                  className="text-sm font-medium text-center py-2 leading-none text-gray-600 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {car.title}
                </label>
                <p 
                  onClick={() => setIsOpen(true)}
                  className="text-xs border bg-gray-200 hover:bg-gray-300 dark:bg-black dark:hover:bg-card cursor-pointer border-border text-center p-1 rounded-sm">
                  Change color
                </p>
              </div>
            </div>
          ))}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change color of bookings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Select color
                  </Label>
                  <Input id="color" type="color" value={color} onChange={handleColorChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
  );
}
