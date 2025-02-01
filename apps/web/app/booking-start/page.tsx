"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export function BookingStartChecklist() {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    documents: [],
    photos: [],
    selfie: [],
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: [...prev[type], ...Array.from(files)],
      }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Start Checklist</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="bookingId">Booking ID</Label>
              <Input
                id="bookingId"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="selectedCar">Selected Car</Label>
              <Select>
                <SelectTrigger
                  id="selectedCar"
                  className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
                >
                  <SelectValue placeholder="Select a car" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="sports">Sports Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date</Label>
              <Input
                id="returnDate"
                type="date"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="returnTime">Return Time</Label>
              <Input
                id="returnTime"
                type="time"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="odometerReading">Odometer Reading</Label>
              <Input
                id="odometerReading"
                type="number"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="bookingAmountReceived">Booking Amount Received</Label>
              <Input
                id="bookingAmountReceived"
                type="number"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="dailyRentalCharges">Daily Rental Charges</Label>
              <Input
                id="dailyRentalCharges"
                type="number"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select>
                <SelectTrigger
                  id="paymentMethod"
                  className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (if any)</Label>
              <Textarea
                id="notes"
                className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="documents">Driving License and Aadhar Card</Label>
            <Input
              id="documents"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, "documents")}
              className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
            />
            <div className="mt-2 text-sm">
              {uploadedFiles.documents.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="photos">Photos before pick-up</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, "photos")}
              className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
            />
            <div className="mt-2 text-sm">
              {uploadedFiles.photos.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="selfie">Upload the selfie with car</Label>
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "selfie")}
              className={cn("border-gray-400 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
            />
            <div className="mt-2 text-sm">
              {uploadedFiles.selfie.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions mentioned above
          </label>
        </div>

        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
          Submit
        </Button>
      </form>
    </div>
  )
}

