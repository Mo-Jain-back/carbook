"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import { toast } from "@/hooks/use-toast";
import { useCarStore } from "@/lib/store"
import { DatePicker } from "@/components/ui/datepicker"
import AddTime from "@/components/add-time"
import dayjs from "dayjs"
import { set } from "date-fns"
import { calculateCost } from "@/components/add-booking"
import { BsFilePdfFill, BsFiletypePdf } from "react-icons/bs"
import { uploadMultipleToDrive, uploadToDrive } from "@/app/actions/upload"

interface FormErrors {
  [key: string]: string;
}

export interface Booking {
    id: string;
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
    const [securityDeposit, setSecurityDeposit] = useState(booking.securityDeposit || "");
    const [odometerReading, setOdometerReading] = useState(Number(booking.odometerReading) || 0);
    const [address, setAddress] = useState(booking.customerAddress);
    const [notes, setNotes] = useState(booking.notes);
    const [bookingAmountReceived, setBookingAmountReceived] = useState(booking.advancePayment || 0);
    const [dailyRentalPrice, setDailyRentalPrice] = useState(booking.dailyRentalPrice || 0);
    const [totalAmount, setTotalAmount] = useState(booking.totalPrice || 0);
    const [paymentMethod, setPaymentMethod] = useState(booking.paymentMethod);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();
    const {cars} = useCarStore();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
      documents: [],
      photos: [],
      selfie: [],
    });

    useEffect(() => {
        const cost = calculateCost(startDate,returnDate,startTime,returnTime,dailyRentalPrice);
        setTotalAmount(cost)
      },[dailyRentalPrice,startDate,returnDate,startTime,returnTime])

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
      if (!dailyRentalPrice) newErrors.dailyRentalPrice = "This field is mandatory";
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
        const length = uploadedFiles[type].length + files.length;
        if(type === "selfie"){
          if(length > 1){
            setErrors(prev => ({ ...prev, [type]: "Please upload only one image" }));
            setUploadedFiles(prev => ({ ...prev, [type]: [] }));
            return;
          }
        }
        else{
          if(length > 5){
            setErrors(prev => ({ ...prev, [type]: "You can upload upto 5 documents or images" }));
            setUploadedFiles(prev => ({ ...prev, [type]: [] }));
            return;
          }
        }
        for (const file of files) {
          if(file.size > 1024*1024*6){
            setErrors(prev => ({ ...prev, [type]: "File size should be less than 6MB" }));
            return;
          }
          if(type === "documents"){
            if(!file.type.startsWith("image/") && !file.type.includes("pdf")){
              setErrors(prev => ({ ...prev, [type]: "Please upload only image or pdf files" }));
              setUploadedFiles(prev => ({ ...prev, [type]: [] }));
              return;
            }
          }
          else{
            if(!file.type.startsWith("image/")){
              setErrors(prev => ({ ...prev, [type]: "Please upload only image" }));
              setUploadedFiles(prev => ({ ...prev, [type]: [] }));
              return;
            }
          }
        }
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
        toast({
          title: `Error`,
          description: `Please fill all mandatory fields`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);
      try {
      
        if(uploadedFiles.documents.length == 0) {
          setErrors(prev => ({ ...prev, ["documents"]: "Please upload at least one document" }));
          return;
        }

        if(uploadedFiles.selfie.length == 0) {
          setErrors(prev => ({ ...prev, ["selfie"]: "Please upload at least one selfie photo" }));
          return;
        }

        if(uploadedFiles.photos.length == 0) {
          setErrors(prev => ({ ...prev, ["photos"]: "Please upload at least one car photo" }));
          return;
        }
        
        const resSelfie = await uploadToDrive(uploadedFiles.selfie[0],"name",booking.customerName + "_" + booking.carName);
        
        if(resSelfie.error || !resSelfie.folderId){
          toast({
            title: `Error`,
            description: `Failed to upload selfie photo`,
            className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
          });
          throw new Error("Failed to upload selfie photo");
          return;
        }

        const resPhoto = await uploadMultipleToDrive(uploadedFiles.photos,"id",resSelfie.folderId);
        
        if(resPhoto.error){
          toast({
            title: `Error`,
            description: `Failed to upload car photo`,
            className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
          });
          throw new Error("Failed to upload car photo");
          return;
        }

        const resDoc = await uploadMultipleToDrive(uploadedFiles.documents,"id",resSelfie.folderId);

        if(resDoc.error){
          toast({
            title: `Error`,
            description: `Failed to upload aadhar card and driving license`,
            className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
          });
          throw new Error("Failed to upload aadhar card and driving license");
          return;
        }
       
        console.log("documents", resDoc.uploadedFiles);  
        await axios.put(`${BASE_URL}/api/v1/booking/${bookingId}/start`, {
          customerName,
          customerContact:phoneNumber,
          selectedCar,
          startDate:startDate.toLocaleDateString('en-US'),
          startTime,
          returnDate:returnDate.toLocaleDateString('en-US'),
          returnTime,
          securityDeposit,
          odometerReading:odometerReading.toString(),
          customerAddress:address,
          bookingAmountReceived,
          dailyRentalPrice,
          totalAmount,
          paymentMethod,
          notes,
          documents:resDoc.uploadedFiles,
          selfieUrl:resSelfie.url,
          carImages:resPhoto.uploadedFiles
        }, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setIsLoading(false);
        toast({
          title: `Booking started`,
          description: `Booking Successfully started`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        });
        router.push("/bookings");
        router.refresh();
      } catch(error) {
        console.log(error);
        toast({
          title: `Error`,
          description: `Failed to submit form`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }

    const getFileIcon = (type: string) => {
      if(!type.startsWith('image/')){
        return <BsFilePdfFill className="w-4 h-4" />
      }
      return <ImageIcon className="w-4 h-4" />
    }

    const renderFileList = (type: string) => (
      <div className="mt-2 text-sm">
        {uploadedFiles[type].map((file, index) => (
          <div
            key={index}
            className="flex w-fit max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
          >
            <span className="min-w-4">
              {getFileIcon(file.type)}
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
      "w-full text-sm",
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
                  <Select value={selectedCar.toString()} onValueChange={(value) => {
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
                  <Select value={paymentMethod}
                  onValueChange={(value) => {
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
                    type="number" 
                    value={odometerReading} 
                    onChange={(e) => {
                      setOdometerReading(Number(e.target.value));
                      setErrors(prev => ({ ...prev, odometerReading: "" }));
                    }}
                    className={cn(inputClassName("odometerReading"),
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     )}
                  />
                  {errors.odometerReading && <p className="text-red-500 text-sm mt-1">{errors.odometerReading}</p>}
                </div>
                  
                <div>
                  <Label className="max-sm:text-xs" htmlFor="bookingAmountReceived">Amount Received <span className="text-red-500">*</span></Label>
                  <Input
                    id="bookingAmountReceived"
                    type="number" 
                    value={bookingAmountReceived} 
                    onChange={(e) => {
                      setBookingAmountReceived(Number(e.target.value));
                      setErrors(prev => ({ ...prev, bookingAmountReceived: "" }));
                    }}
                    className={cn(inputClassName("bookingAmountReceived"),
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     )}
                  />
                  {errors.bookingAmountReceived && <p className="text-red-500 text-sm mt-1">{errors.bookingAmountReceived}</p>}
                </div>
              </div>
              <div className="flex justify-between space-x-2 items-center">
                <div>
                  <Label className="max-sm:text-xs" htmlFor="dailyRentalPrice">Daily Rental Charges <span className="text-red-500">*</span></Label>
                  <Input
                    id="dailyRentalPrice"
                    type="number" 
                    value={dailyRentalPrice} 
                    onChange={(e) => {
                      setDailyRentalPrice(Number(e.target.value));
                      setErrors(prev => ({ ...prev, dailyRentalPrice: "" }));
                    }}
                    className={cn(inputClassName("dailyRentalPrice"),
                      "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     )}
                  />
                  {errors.dailyRentalPrice && <p className="text-red-500 text-sm mt-1">{errors.dailyRentalPrice}</p>}
                </div>
                <div>
                  <Label className="max-sm:text-xs" htmlFor="totalAmount">Total Amount <span className="text-red-500">*</span></Label>
                  <Input
                    id="totalAmount"
                    type="number" 
                    value={totalAmount} 
                    readOnly
                    className={cn(inputClassName("totalAmount"),
                      "focus-visible:ring-0 focus:border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     )}
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
            <Button type="submit" className={`bg-blue-600 text-white hover:bg-opacity-80 w-full ${isLoading && "cursor-not-allowed opacity-50"}`}>
                  {isLoading ?
                    <>
                    <span>Please wait</span>
                    <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                      </div>
                    </>
                  :
                  <span>Create</span>
                  }
              </Button>
              {!isLoading &&
                  <Button  
                    onClick={() => router.push('/booking/'+bookingId)}
                    className="bg-red-600 text-card text-white hover:bg-red-500 w-full"
                  >
                    Cancel
                  </Button>
            }
          </div>
        </form>
      </div>
    )
}