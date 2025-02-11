"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Price from "@/public/price-tag.svg"
import { DatePicker } from "./ui/datepicker"
import AddTime from "./add-time"
import dayjs from "dayjs";
import CarFrontIcon from "@/public/car-front.svg";
import UserIcon from "@/public/user.svg";
import Calendar from "@/public/date-and-time.svg"
import Rupee from "@/public/rupee-symbol.svg";
import Shield from "@/public/shield.svg";
import Booking from "@/public/online-booking.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
interface Car {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  imageUrl: string;
}
export function CarBookingDialog({isOpen, setIsOpen, cars}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, cars: Car[]}) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate,setEndDate] = useState<Date>(new Date());
  const [startTime,setStartTime] = useState<string>('00:00');
  const [endTime,setEndTime] = useState<string>('00:00');
  const [car,setCar] = useState<number>(cars[0].id);
  const [price,setPrice] = useState<number>(0);
  const [totalAmount,setTotalAmount] = useState<number>(0);
  const [name,setName] = useState<string>("");
  const [contact,setContact] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/booking`,{
        startDate: startDate.toLocaleDateString('en-US'),
        endDate: endDate.toLocaleDateString('en-US'),
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        carId: car,
        customerName: name,
        customerContact: contact,
        dailyRentalPrice: totalAmount,
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem('token')
          }
      });
      console.log(res.data);
    }
    catch(error){
      console.log(error);
    }
  }

  const handleDateChange = (date:Date,type?:string) => {
    if(type === "start") {
      setStartDate(date);
    } else if(type === "end") {
      setEndDate(date);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] dark:border-gray-700 md:max-w-[600px] h-[82vh] sm:top-[55%] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mt-30 text-blue-700 dark:text-blue-600">
            <Booking className="w-6 h-6 flex-shrink-0 stroke-[6px] stroke-blue-600 fill-blue-600" />
            Add Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
          <CarFrontIcon className="w-6 h-4 dark:stroke-blue-200 dark:fill-blue-200 stroke-[6px] stroke-black fill-black flex-shrink-0" /> 
            <Label htmlFor="car" className="w-1/3">
              Select your car
            </Label>
            <Select>
              <SelectTrigger id="car" className="w-2/3 border-input  focus:border-blue-400 focus:ring-blue-400 focus-visible:ring-blue-400 focus:outline-none">
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent className="dark:border-gray-700">
              {cars && cars.length > 0 && cars.map((car) => (
                <SelectItem 
                  key={car.id}
                  className=" focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer" 
                  value={car.id.toString()}
                  onClick={() => setCar(car.id)}
                  >{car.brand + " " + car.model}</SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 flex-shrink-0 fill-black dark:fill-white stroke-black dark:stroke-white stroke-[1px]" />
              <Label className="w-1/3">Select date and time</Label>
            </div>
            <div className="flex items-center gap-2 ml-9">
              <Label htmlFor="fromDate" className="w-1/6">
                From
              </Label>
              <div className="flex space-x-4" >
                <div className="" >
                  <DatePicker currDate={dayjs(startDate)} handleDateChange={handleDateChange} dateType="start"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="" selectedTime={startTime} setSelectedTime={setStartTime} />
                  <input type="hidden" name="time" value={startTime} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-9">
              <Label htmlFor="toDate" className="w-1/6">
                To
              </Label>
              <div className="flex space-x-4">
                <div className="">
                  <DatePicker currDate={dayjs(endDate)} handleDateChange={handleDateChange} dateType="end"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="" selectedTime={endTime} setSelectedTime={setEndTime} />
                  <input type="hidden" name="time" value={endTime} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserIcon className="h-5 w-5 flex-shrink-0 stroke-[12px] stroke-black fill-black dark:stroke-white dark:fill-white" />
            <div className="flex w-full gap-2 sm:gap-4">
              <div>
                <Label htmlFor="name" className="w-1/3">
                  Customer Name
                </Label>
                <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} 
                  className="w-2/3 border-input min-w-[130px] w-full focus:border-blue-400 focus-visible:ring-blue-400 "/>
              </div>
              <div>
                <Label htmlFor="name" className="w-1/3">
                  Contact
                </Label>
                <Input type="text" id="name" value={contact} onChange={(e) => setContact(e.target.value)} 
                  className="w-2/3 border-input min-w-[130px] w-full focus:border-blue-400 focus-visible:ring-blue-400 "/>
              </div>
            </div>
          </div>

          

          <div className="flex items-center gap-4">
            <Price className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-black fill-black dark:stroke-white dark:fill-white" />
            <Label htmlFor="price" className="w-1/3">
              24 hr price
            </Label>
            <Input type="number" id="price" 
            className="w-2/3 border-input  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            value={price} onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-4">
            <Rupee className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[2px] stroke-black fill-black dark:stroke-white dark:fill-white" />
            <Label htmlFor="totalAmount" className="w-1/3">
              Total amount
            </Label>
            <Input type="number" id="totalAmount" 
            value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="w-2/3 border-input  focus:border-blue-400 focus-visible:ring-blue-400  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>

          

          <Button type="submit" className="bg-blue-600 text-card hover:bg-opacity-80 w-full">
              Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

