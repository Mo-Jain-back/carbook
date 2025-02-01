"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, Calendar, Clock, User, Palette, DollarSign, Shield } from "lucide-react"

export function CarBookingDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [color, setColor] = useState("#000000")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] h-[95vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-6 w-6" />
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
              <SelectTrigger id="car" className="w-2/3">
                <SelectValue placeholder="Select a car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sports">Sports Car</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <Label className="w-1/3">Select time and date</Label>
            </div>
            <div className="flex items-center gap-4 ml-9">
              <Label htmlFor="fromDate" className="w-1/6">
                From
              </Label>
              <Input type="date" id="fromDate" className="w-1/3" />
              <Input type="time" id="fromTime" className="w-1/3" />
            </div>
            <div className="flex items-center gap-4 ml-9">
              <Label htmlFor="toDate" className="w-1/6">
                To
              </Label>
              <Input type="date" id="toDate" className="w-1/3" />
              <Input type="time" id="toTime" className="w-1/3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <User className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="name" className="w-1/3">
              Name of person booking
            </Label>
            <Input type="text" id="name" className="w-2/3" />
          </div>

          <div className="flex items-center gap-4">
            <Palette className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="color" className="w-1/3">
              Select color for booking
            </Label>
            <div className="w-2/3 flex items-center gap-2">
              <div
                className="w-8 h-8 border border-gray-300 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => document.getElementById("colorPicker")?.click()}
              />
              <Input
                type="color"
                id="colorPicker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="price" className="w-1/3">
              24 hr price
            </Label>
            <Input type="number" id="price" className="w-2/3" />
          </div>

          <div className="flex items-center gap-4">
            <DollarSign className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="totalAmount" className="w-1/3">
              Total amount
            </Label>
            <Input type="number" id="totalAmount" className="w-2/3" />
          </div>

          <div className="flex items-center gap-4">
            <Shield className="h-5 w-5 flex-shrink-0" />
            <Label htmlFor="securityDeposit" className="w-1/3">
              Security deposit
            </Label>
            <Input type="number" id="securityDeposit" className="w-2/3" />
          </div>

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

