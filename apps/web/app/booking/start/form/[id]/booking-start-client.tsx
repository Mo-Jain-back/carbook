"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Image } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import { toast } from "sonner"
import { useCarStore } from "@/lib/store"
import { DatePicker } from "@/components/ui/datepicker"
import AddTime from "@/components/add-time"
import dayjs from "dayjs"
import { set } from "date-fns"

interface FormErrors {
  [key: string]: string;
}

export interface Booking {
    id: number;
    start: string;
    end: string;
    startTime: string;
    endTime: string;
    status: string;
    customerName: string;
    customerContact: string;
    carId:number;
    carName: string;
    carPlateNumber: string;
    carImageUrl: string;
    dailyRentalPrice: number;
    securityDeposit?: string;
    totalPrice?: number;
    advancePayment?: number;
    customerAddress?: string;
    paymentMethod?: string;
    drivingLicence?: string;
    aadharCard?: string;
    odometerReading?: string;
    notes?: string;
  }

export default function BookingStartClient({booking,bookingId} : {
    booking: Booking,
    bookingId: string | string[]
}) {
    const [customerName, setCustomerName] = useState(booking.customerName);
    const [phoneNumber, setPhoneNumber] = useState(booking.customerContact);
    const [selectedCar, setSelectedCar] = useState(booking.carId);
    const [startDate, setStartDate] = useState(new Date(booking.start));
    const [startTime, setStartTime] = useState(booking.startTime);
    const [returnDate, setReturnDate] = useState(new Date(booking.end));
    const [returnTime, setReturnTime] = useState(booking.endTime);
    const [securityDeposit, setSecurityDeposit] = useState(booking.securityDeposit);
    const [odometerReading, setOdometerReading] = useState(booking.odometerReading);
    const [address, setAddress] = useState(booking.customerAddress);
    const [notes, setNotes] = useState(booking.notes);
    const [bookingAmountReceived, setBookingAmountReceived] = useState("");
    const [dailyRentalCharges, setDailyRentalCharges] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();
    const {cars} = useCarStore();
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
      documents: [],
      photos: [],
      selfie: [],
    });


    const validateForm = () => {
      const newErrors: FormErrors = {};
      
      if (!customerName) newErrors.customerName = "This field is mandatory";
      if (!phoneNumber) newErrors.phoneNumber = "This field is mandatory";
      if (!selectedCar) newErrors.selectedCar = "This field is mandatory";
      if (!startDate) newErrors.startDate = "This field is mandatory";
      if (!startTime) newErrors.startTime = "This field is mandatory";
      if (!returnDate) newErrors.returnDate = "This field is mandatory";
      if (!returnTime) newErrors.returnTime = "This field is mandatory";
      if (!securityDeposit) newErrors.securityDeposit = "This field is mandatory";
      if (!odometerReading) newErrors.odometerReading = "This field is mandatory";
      if (!address) newErrors.address = "This field is mandatory";
      if (!bookingAmountReceived) newErrors.bookingAmountReceived = "This field is mandatory";
      if (!dailyRentalCharges) newErrors.dailyRentalCharges = "This field is mandatory";
      if (!totalAmount) newErrors.totalAmount = "This field is mandatory";
      if (!paymentMethod) newErrors.paymentMethod = "This field is mandatory";
      if (!termsAccepted) newErrors.terms = "You must accept the terms and conditions";
      if (uploadedFiles.documents.length === 0) newErrors.documents = "Documents are mandatory";
      if (uploadedFiles.photos.length === 0) newErrors.photos = "Photos are mandatory";
      if (uploadedFiles.selfie.length === 0) newErrors.selfie = "Selfie is mandatory";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const files = event.target.files
      if (files) {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: [...prev[type], ...Array.from(files)],
        }))
        setErrors(prev => ({ ...prev, [type]: "" }));
      }
    }

    const handleRemoveFile = (type: string, index: number) => {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }))
    }

    const handleSubmit = async(event: React.FormEvent) => {
      event.preventDefault()
      
      if (!validateForm()) {
        toast.error("Please fill all mandatory fields");
        return;
      }

      try {
        await axios.post(`${BASE_URL}/api/v1/booking/${bookingId}/start`, {
          customerName,
          phoneNumber,
          selectedCar,
          startDate,
          startTime,
          returnDate,
          returnTime,
          securityDeposit,
          odometerReading,
          address,
          bookingAmountReceived,
          dailyRentalCharges,
          totalAmount,
          paymentMethod,
          notes
        }, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        router.push("/bookings");
      } catch(error) {
        console.log(error);
        toast.error("Failed to submit form");
      }
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

    const handleDateChange = (date:Date,type?:string) => {
      if(type === "start") {
        setStartDate(date);
      } else if(type === "end") {
        setReturnDate(date);
      }
    }

    const inputClassName = (fieldName: string) => cn(
      "w-full",
      errors[fieldName] && "border-red-500 focus:border-red-500"
    );

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold ">Booking Start Checklist</h1>
        <div className="mb-6">
          <span className="text-sm text-blue-600 dark:text-blue-400">Booking Id: </span>
          <span className="text-sm">{bookingId}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 max-sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between space-x-2 items-center">
                <div>
                  <Label className="max-sm:text-xs" htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="customerName" 
                    value={customerName} 
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setErrors(prev => ({ ...prev, customerName: "" }));
                    }}
                    className={inputClassName("customerName")}
                  />
                  {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <Label className="max-sm:text-xs" htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                  <Input 
                    id="phoneNumber" 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrors(prev => ({ ...prev, phoneNumber: "" }));
                    }}
                    className={inputClassName("phoneNumber")}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
              <div className="flex space-x-2 justify-between items-center">
                  <div >
                    <Label className="max-sm:text-xs" htmlFor="startDate">Start Date & Time <span className="text-red-500">*</span></Label>
                      <div className="flex space-x-2 justify-between items-center">
                        <div className="border border-border rounded-sm">
                          <DatePicker className="w-full" currDate={dayjs(startDate)} handleDateChange={handleDateChange} dateType="start"/>
                        </div>
                        <div className="border border-border rounded-sm mx-2">
                          <AddTime className="w-full h-9" selectedTime={startTime} setSelectedTime={setStartTime} />
                          <input type="hidden" name="time" value={startTime} />
                        </div>
                      </div>
                  </div>
                  <div>
                  <div >
                    <Label className="max-sm:text-xs" htmlFor="startDate">Return Date & Time <span className="text-red-500">*</span></Label>
                      <div className="flex space-x-2 justify-between items-center">
                        <div className="border border-border rounded-sm">
                          <DatePicker className="w-full" currDate={dayjs(returnDate)} handleDateChange={handleDateChange} dateType="end"/>
                        </div>
                        <div className="border border-border rounded-sm mx-2">
                          <AddTime className="w-full h-9" selectedTime={returnTime} setSelectedTime={setReturnTime} />
                          <input type="hidden" name="time" value={returnTime} />
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between space-x-2 items-center">
                <div className="w-full">
                  <Label className="max-sm:text-xs" htmlFor="selectedCar">Selected Car <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(value) => {
                    setSelectedCar(Number(value));
                    setErrors(prev => ({ ...prev, selectedCar: "" }));
                  }}>
                    <SelectTrigger id="selectedCar" value={selectedCar} className={inputClassName("selectedCar")}>
                      <SelectValue placeholder="Select a car" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-gray-700">
                    {cars && cars.length > 0 && cars.map((car) => (
                      <SelectItem 
                        key={car.id}
                        value={car.id.toString()}
                        >{car.brand + " " + car.model}</SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedCar && <p className="text-red-500 text-sm mt-1">{errors.selectedCar}</p>}
                </div>
                <div className="w-full">
                  <Label className="max-sm:text-xs" htmlFor="paymentMethod">Payment Method <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(value) => {
                    setPaymentMethod(value);
                    setErrors(prev => ({ ...prev, paymentMethod: "" }));
                  }}>
                    <SelectTrigger
                      id="paymentMethod"
                      value={paymentMethod}
                      className={inputClassName("paymentMethod")}
                    >
                      <SelectValue className="placeholder:text-xs" placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-gray-800">
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                </div>
              </div>
              <div>
                <Label className="max-sm:text-xs" htmlFor="address">Address <span className="text-red-500">*</span></Label>
                <Textarea
                  id="address" 
                  value={address} 
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors(prev => ({ ...prev, address: "" }));
                  }}
                  className={inputClassName("address")}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between space-x-2 items-center">
                <div>
                  <Label className="max-sm:text-xs" htmlFor="odometerReading">Odometer Reading <span className="text-red-500">*</span></Label>
                  <Input
                    id="odometerReading"
                    type="text" 
                    value={odometerReading} 
                    onChange={(e) => {
                      setOdometerReading(e.target.value);
                      setErrors(prev => ({ ...prev, odometerReading: "" }));
                    }}
                    className={inputClassName("odometerReading")}
                  />
                  {errors.odometerReading && <p className="text-red-500 text-sm mt-1">{errors.odometerReading}</p>}
                </div>
                  
                <div>
                  <Label className="max-sm:text-xs" htmlFor="bookingAmountReceived">Amount Received <span className="text-red-500">*</span></Label>
                  <Input
                    id="bookingAmountReceived"
                    type="text" 
                    value={bookingAmountReceived} 
                    onChange={(e) => {
                      setBookingAmountReceived(e.target.value);
                      setErrors(prev => ({ ...prev, bookingAmountReceived: "" }));
                    }}
                    className={inputClassName("bookingAmountReceived")}
                  />
                  {errors.bookingAmountReceived && <p className="text-red-500 text-sm mt-1">{errors.bookingAmountReceived}</p>}
                </div>
              </div>
              <div className="flex justify-between space-x-2 items-center">
                <div>
                  <Label className="max-sm:text-xs" htmlFor="dailyRentalCharges">Daily Rental Charges <span className="text-red-500">*</span></Label>
                  <Input
                    id="dailyRentalCharges"
                    type="text" 
                    value={dailyRentalCharges} 
                    onChange={(e) => {
                      setDailyRentalCharges(e.target.value);
                      setErrors(prev => ({ ...prev, dailyRentalCharges: "" }));
                    }}
                    className={inputClassName("dailyRentalCharges")}
                  />
                  {errors.dailyRentalCharges && <p className="text-red-500 text-sm mt-1">{errors.dailyRentalCharges}</p>}
                </div>
                <div>
                  <Label className="max-sm:text-xs" htmlFor="totalAmount">Total Amount <span className="text-red-500">*</span></Label>
                  <Input
                    id="totalAmount"
                    type="text" 
                    value={totalAmount} 
                    onChange={(e) => {
                      setTotalAmount(e.target.value);
                      setErrors(prev => ({ ...prev, totalAmount: "" }));
                    }}
                    className={inputClassName("totalAmount")}
                  />
                  {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
                </div>
              </div>
              <div>
                <Label className="max-sm:text-xs" htmlFor="securityDeposit">Security Deposit <span className="text-red-500">*</span></Label>
                <Input 
                  type="text" 
                  id="securityDeposit" 
                  value={securityDeposit} 
                  onChange={(e) => {
                    setSecurityDeposit(e.target.value);
                    setErrors(prev => ({ ...prev, securityDeposit: "" }));
                  }}
                  className={inputClassName("securityDeposit")}
                />
                {errors.securityDeposit && <p className="text-red-500 text-sm mt-1">{errors.securityDeposit}</p>}
              </div>
              
              <div>
                <Label className="max-sm:text-xs" htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
            <div>
              <Label className="max-sm:text-xs" htmlFor="documents">Driving License and Aadhar Card <span className="text-red-500">*</span></Label>
              <Input
                id="documents"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "documents")}
                className={cn(inputClassName("documents"),
                  "max-sm:text-xs "
                 )}
              />
              {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
              {(renderFileList("documents") )}
            </div>
            <div>
              <Label className="max-sm:text-xs" htmlFor="photos">Photos before pick-up <span className="text-red-500">*</span></Label>
              <Input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "photos")}
                className={cn(inputClassName("photos"),
                  "max-sm:text-xs "
                 )}
              />
              {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
              {renderFileList("photos")}
            </div>
            <div>
              <Label className="max-sm:text-xs" htmlFor="selfie">Upload the selfie with car <span className="text-red-500">*</span></Label>
              <Input
                id="selfie"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "selfie")}
                className={cn(inputClassName("selfie"),
                  "max-sm:text-xs "
                 )}
              />
              {errors.selfie && <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>}
              {renderFileList("selfie")}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={() => {
                setTermsAccepted(!termsAccepted);
                setErrors(prev => ({ ...prev, terms: "" }));
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions mentioned above <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}

          <div className="flex items-center space-x-2">
            <Button type="submit" className="bg-blue-600 text-black dark:text-white text-card hover:bg-opacity-80 w-full">
              Create
            </Button>
            <Button  
              onClick={() => router.push('/booking/'+bookingId)}
              className="bg-red-600 text-card text-white hover:bg-red-500 w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    )
}