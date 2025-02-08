"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {  Image } from "lucide-react"

export default function BookingStartChecklist() {
    const [customerName, setCustomerName] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCar, setSelectedCar] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [returnTime, setReturnTime] = useState("");
    const [securityDeposit,setSecurityDeposit] = useState("");
    const [odometerReading, setOdometerReading] = useState("");
    const [address, setAddress] = useState("");
    const [bookingAmountReceived, setBookingAmountReceived] = useState("");
    const [dailyRentalCharges, setDailyRentalCharges] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    documents: [],
    photos: [],
    selfie: [],
  });

  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: [...prev[type], ...Array.from(files)],
      }))
    }
  }

  const handleRemoveFile = (type: string, index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted")
  }

  const renderFileList = (type: string) => (
    <div className="mt-2 text-sm">
      {uploadedFiles[type].map((file, index) => (
        <div
          key={index}
          className="flex w-fit max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 p-2 rounded-md"
        >
          <span className="min-w-4">
            <Image className="w-4 h-4" />
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{file.name}</span>
          <span
            className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
            onClick={() => handleRemoveFile(type, index)}
          >
            +
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Start Checklist</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
          <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bookingId">Booking ID</Label>
              <Input id="bookingId" value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="selectedCar">Selected Car</Label>
              <Select onValueChange={setSelectedCar}>
                <SelectTrigger id="selectedCar" value={selectedCar}>
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
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date</Label>
              <Input id="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="returnTime">Return Time</Label>
              <Input id="returnTime" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
            </div>
            <div >
              <Label htmlFor="securityDeposit" className="w-1/3">
                Security deposit
              </Label>
              <Input type="text" id="securityDeposit" 
                value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)}
                />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="odometerReading">Odometer Reading</Label>
              <Input
                id="odometerReading"
                type="text" value={odometerReading} onChange={(e) => setOdometerReading(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address" value={address} onChange={(e) => setAddress(e.target.value)}
                className="h-28 sm:max-h-28 sm:max-h-28"
                 />
            </div>
            <div>
              <Label htmlFor="bookingAmountReceived">Booking Amount Received</Label>
              <Input
                id="bookingAmountReceived"
                type="text" value={bookingAmountReceived} onChange={(e) => setBookingAmountReceived(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dailyRentalCharges">Daily Rental Charges</Label>
              <Input
                id="dailyRentalCharges"
                type="text" value={dailyRentalCharges} onChange={(e) => setDailyRentalCharges(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger
                  id="paymentMethod"
                  value={paymentMethod}
                >
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="dark:border-gray-800">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (if any)</Label>
              <Textarea
                id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                className="h-28 sm:max-h-28"
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
            />
            {renderFileList("documents")}
          </div>
          <div>
            <Label htmlFor="photos">Photos before pick-up</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, "photos")}
            />
            {renderFileList("photos")}
          </div>
          <div>
            <Label htmlFor="selfie">Upload the selfie with car</Label>
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "selfie")}
            />
            {renderFileList("selfie")}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={termsAccepted} onCheckedChange={() => setTermsAccepted(!termsAccepted)} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions mentioned above
          </label>
        </div>
        <div className="flex items-center space-x-2">

          <Button type="submit" className="bg-blue-600 text-card hover:bg-opacity-80 w-full">
                Create
            </Button>
            <Button  className="bg-red-600 text-card hover:bg-opacity-80 w-full">
              Cancel
            </Button>
          </div>
      </form>
    </div>
  )
}

