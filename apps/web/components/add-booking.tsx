"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Calendar, Clock, User, Palette, DollarSign, Shield } from "lucide-react"
import AppointmentIcon from "../public/pending-appointment.svg"
import { DatePicker } from "./ui/datepicker"
import AddTime from "./add-time"
import dayjs from "dayjs"

export function CarBookingDialog({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [color, setColor] = useState("#000000");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate,setEndDate] = useState<Date>(new Date());
  const [startTime,setStartTime] = useState<string>('00:00');
  const [endTime,setEndTime] = useState<string>('00:00');
  const [car,setCar] = useState<string>("");
  const [price,setPrice] = useState<number>(0);
  const [totalAmount,setTotalAmount] = useState<number>(0);
  const [securityDeposit,setSecurityDeposit] = useState<number>(0);
  const [name,setName] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {

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
            <AppointmentIcon className="w-6 h-6 "/>
            Add Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <Car className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="car" className="w-1/3">
              Select your car
            </Label>
            <Select>
              <SelectTrigger id="car" className="w-2/3  focus:border-blue-400 focus:ring-blue-400 focus-visible:ring-blue-400 focus:outline-none">
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent className="dark:border-gray-700">
                <SelectItem 
                  className=" focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer" 
                  value="sedan"
                  onClick={() => setCar("sedan")}
                  >Sedan</SelectItem>
                <SelectItem 
                  className=" focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer" 
                  value="suv"
                  onClick={() => setCar("suv")}
                  >SUV</SelectItem>
                <SelectItem 
                  className=" focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer" 
                  value="sports"
                  onClick={() => setCar("sports")}
                  >Sports Car</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 flex-shrink-0" />
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
            <User className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="name" className="w-1/3">
              Name of person booking
            </Label>
            <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} 
              className="w-2/3  focus:border-blue-400 focus-visible:ring-blue-400 "/>
          </div>

          

          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="price" className="w-1/3">
              24 hr price
            </Label>
            <Input type="number" id="price" 
            className="w-2/3  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            value={price} onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-4">
            <DollarSign className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="totalAmount" className="w-1/3">
              Total amount
            </Label>
            <Input type="number" id="totalAmount" 
            value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="w-2/3  focus:border-blue-400 focus-visible:ring-blue-400  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>

          <div className="flex items-center gap-4">
            <Shield className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="securityDeposit" className="w-1/3">
              Security deposit
            </Label>
            <Input type="number" id="securityDeposit" 
            value={securityDeposit} onChange={(e) => setSecurityDeposit(Number(e.target.value))}
            className="w-2/3  focus:border-blue-400 focus-visible:ring-blue-400  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>

          <Button type="submit" className="bg-blue-600 text-card hover:bg-opacity-80 w-full">
              Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

