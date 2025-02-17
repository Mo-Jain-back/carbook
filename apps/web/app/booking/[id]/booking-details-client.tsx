import { Button } from "@/components/ui/button"
import {  Edit, ImageIcon, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import {  useRouter } from "next/navigation"
import { startTransition, useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/datepicker";
import dayjs from "dayjs";
import AddTime from "@/components/add-time";
import ArrowRight from "@/public/right_arrow.svg"
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import BackArrow from "@/public/back-arrow.svg";
import { StatusInput } from "@/components/ui/status-input";
import CarIcon from "@/public/car-icon.svg"
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { Booking } from "./page";
import ActionDialog from "@/components/action-dialog";
import { calculateCost } from "@/components/add-booking";
import { getHeader } from "@/app/bookings/page";
import Link from "next/link";
import { BsFilePdfFill } from "react-icons/bs";
import { toast } from "@/hooks/use-toast";


interface BookingDetailsClientProps {
  booking : Booking,
  setBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

export function BookingDetailsClient({ booking,setBooking }: BookingDetailsClientProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [startDate, setStartDate] = useState(new Date(booking.start));
  const [endDate,setEndDate] = useState(new Date(booking.end));
  const [startTime,setStartTime] = useState(booking.startTime);
  const [endTime,setEndTime] = useState(booking.endTime);
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [action,setAction] = useState<string>("Start");
  const [name,setName] = useState<string>(booking.customerName);
  const [number,setNumber] = useState<string>(booking.customerContact);
  const [dailyRentalPrice,setDailyRentalPrice] = useState<number>(booking.dailyRentalPrice);
  const [paymentMethod,setPaymentMethod] = useState(booking.paymentMethod);
  const [advancePayment,setAdvancePayment] = useState(booking.advancePayment);
  const [totalAmount,setTotalAmount] = useState(booking.totalPrice);
  
  useEffect(() => {
    const cost = calculateCost(startDate,endDate,startTime,endTime,dailyRentalPrice);
    setTotalAmount(cost);
  },[dailyRentalPrice,startDate,endDate,startTime,endTime])

  function handleAction() {
    //add code to stop or start the booking
    if(action === "Start") {
      router.push(`/booking/start/form/${booking.id}`);
    } else if(action === "Stop"){
      handleBookingStop();
    }
    else if(action === "Delete"){
      handleDelete();
    }
    else if(action === "Update"){
      handleEdit();
    }
    else if(action === "delete the documents of"){
      handleDocumentDelete();
    }
    else if(action === "delete the car photos of"){
      handleCarImageDelete();
    }
    return;
  }

  const getFileIcon = (type: string) => {
      if(!type.startsWith('image/')){
        return <BsFilePdfFill className="w-4 h-4" />
      }
      return <ImageIcon className="w-4 h-4" />
    }

  const handleBookingStop = async () => {
    let currDate = new Date();
  
    // Format back to HH:MM
    let newHours = currDate.getHours().toString().padStart(2, "0");
    let newMinutes = currDate.getMinutes().toString().padStart(2, "0");
    try {
      const newEndDate = new Date();
      const newEndTime = `${newHours}:${newMinutes}`;
      await axios.put(`${BASE_URL}/api/v1/booking/${booking.id}/end`, {
        endDate: newEndDate.toLocaleDateString('en-US'),
        endTime:newEndTime,
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });
      setBookingStatus("Completed");
      setEndDate(newEndDate);
      setEndTime(newEndTime);
      toast({
        title: `Booking ended`,
        description: `Booking Successfully ended`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      router.push('/bookings');
    }
    catch(error){ 
      console.log(error);
      toast({
        title: `Error`,
        description: `Booking failed to end`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
    }
  }

  const handleDateChange = (date:Date,type?:string) => {
    if(type === "start") {
      setStartDate(date);
    } else if(type === "end") {
      setEndDate(date);
    }
  }



  function handleCancel() {
    //add code to stop or start the booking
    setIsEditable(!isEditable);
    setStartDate(new Date(booking.start));
    setEndDate(new Date(booking.end));
    setBookingStatus(booking.status);
    setName(booking.customerName);
    setNumber(booking.customerContact);
    return;
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/booking/${booking.id}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      toast({
        title: `Booking deleted`,
        description: `Booking Successfully deleted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
  
      router.push('/bookings');
      // Await the push to ensure smooth navigation
  
    } catch (error) {
      toast({
        title: `Error`,
        description: `Booking failed to delete`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
      
      console.error(error);
      router.push('/bookings');
    }
  };
  

  const handleDocumentDelete = async() => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/booking/${booking.customerId}/documents/all`, {
        headers: {
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });
      setBooking({...booking, documents:[]});
      toast({
        title: `Document deleted`,
        description: `Document Successfully deleted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });

    } catch(error) {
      toast({
        title: `Error`,
        description: `Failed to delete document`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
      console.log(error);
    }
  }

  const handleCarImageDelete = async() => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/booking/${booking.id}/car-images/all`, {
        headers: {
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });
      setBooking({...booking, carImages:[]});
      toast({
        title: `Car image deleted`,
        description: `Car image Successfully deleted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      
    } catch(error) {
      toast({
        title: `Error`,
        description: `Failed to delete car image`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });      
      console.log(error);
    }
  }

  const handleEdit = async () => {
    // Implement edit functionality here
    console.log("Edit car:", booking.id);
    try {
      await axios.put(`${BASE_URL}/api/v1/booking/${booking.id}`,{
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        carId: booking.carId,
        customerAddress: booking.customerAddress,
        customerContact: booking.customerContact,
        securityDeposit: booking.securityDeposit,
        dailyRentalPrice: dailyRentalPrice,
        paymentMethod: paymentMethod,
        totalAmount
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsEditable(false);
      toast({
        title: `Booking updated`,
        description: `Booking Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    }
    catch(error){ 
      console.log(error);
      toast({
        title: `Error`,
        description: `Booking failed to update`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
    }
  }
  
  return (
    <div >
      <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-300 dark:border-muted" >
          <div
            className="mr-2 rounded-md font-bold  cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
            onClick={() => router.push('/bookings')} 
          >
            <div className="h-10 w-9 flex border-border border justify-center items-center rounded-md ">
                <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </div>
          </div>
         
        <div className="text-center">
          <h2 className="text-xl font-bold">Booking {bookingStatus}</h2>
          <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
        </div>
        <div className="mr-4">
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleCancel}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    setAction("Delete");
                    setIsDialogOpen(true);
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div> {/* Spacer for alignment */}
      </div>

      <div className="px-4 py-4 border-b-4 border-gray-200 dark:border-muted" >
          <div className="flex justify-between items-center">
            <div>
                  <p className="text-sm text-blue-500">
                    {getHeader(bookingStatus,startDate.toDateString(),startTime,endDate.toDateString(),endTime)}
                  </p>
                  <p className="font-semibold max-sm:text-sm">{formatDateTime(bookingStatus==="Upcoming" ? startDate : endDate)}</p>
            </div>
            <div className="text-right">
            <div className="relative flex items-center sm:h-24 sm:w-36 rounded-md border border-border h-12 mb-2"> 
                  { booking.carImageUrl !== "" ?
                    <Image
                    src={booking.carImageUrl}
                    alt={booking.carName}
                    fill
                    className="object-cover rounded w-full"
                  />
                  :
                  <CarIcon className="w-full dark:stroke-blue-200 p-1  dark:fill-blue-200 stroke-black fill-black" /> 
                  }
                </div>
              <p className="text-sm font-semibold text-[#4B4237] dark:text-gray-400">{booking.carName}</p>
              <p className="text-xs text-blue-500">{booking.carPlateNumber}</p>
            </div>
          </div>
      </div>

      <div className="px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
          <h3 className="text-lg font-semibold mb-4 ">Booking Details</h3>
          <div className="flex items-center justify-center gap-8 mb-4">
            <div>
              <p className="text-sm text-blue-500">From</p>
              {!isEditable ?
              <p className="font-semibold max-sm:text-sm">{formatDateTime(startDate)}  {booking.startTime}</p>
              : 
              <div className="flex space-x-2">
                <div className="">
                  <DatePicker currDate={dayjs(startDate)} handleDateChange={handleDateChange} dateType="start"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="" selectedTime={startTime} setSelectedTime={setStartTime} />
                  <input type="hidden" name="time" value={startTime} />
                </div>
              </div>
              }
            </div>
            <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-500">To</p>
              {!isEditable ?
              <p className="font-semibold max-sm:text-sm">{formatDateTime(endDate)} {booking.endTime}</p>
              :
              <div className="flex space-x-2">
                <div className="">
                  <DatePicker currDate={dayjs(endDate)} handleDateChange={handleDateChange} dateType="end"/>
                </div>
                <div className=" mx-2">
                  <AddTime className="" selectedTime={endTime} setSelectedTime={setEndTime} />
                <input type="hidden" name="time" value={endTime} />
              </div>
              </div>
            }
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-muted" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-blue-500 mb-1">Booked by</p>
              { !isEditable ?
              <>
                <p className="font-semibold">{name}</p>
                <p className="text-sm">{number}</p>
              </>
              :
              <>
                <Input type="text" id="name" value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-[170px] border-0 p-0 px-1 bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 " />
                <Input type="text" id="number" value={number} 
                  onChange={(e) => setNumber(e.target.value)} 
                  className="w-[170px] border-0 p-0 px-1 my-1 bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  " />
              </>
              }
            </div>
            <div>
              {booking.customerAddress &&<div>
                <p className="text-sm text-blue-500">Address</p>
                <span className="text-sm whitespace-wrap max-w-[120px]">{booking.customerAddress}</span>
              </div>}
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-muted" />
          <div>
            <p className="text-sm text-blue-500 mb-1">Booking Status</p>
            <div >
              { isEditable ? (
                <StatusInput status={bookingStatus} setStatus={setBookingStatus} />
              ) : (
                <p className={` `} >{bookingStatus}</p>
              )}
            </div>
          </div>          
      </div>
      <div className="px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
          <h3 className="text-lg font-semibold mb-4 ">Price and Payment Details</h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-sm text-blue-500 mb-1">24 Hr Price</p>
              { !isEditable ?
                <p className="text-sm">{dailyRentalPrice}</p>
              :
              <>
                <Input type="text" id="number" value={dailyRentalPrice} onChange={(e) => setDailyRentalPrice(Number(e.target.value))}
                  className="w-[170px] border-0 p-0 px-1 my-1 bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  " />
              </>
              }
            </div>
            {booking.securityDeposit && 
            <div>
              <p className="text-sm text-blue-500">Security Deposit</p>
              <span className="text-sm">{booking.securityDeposit}</span>
            </div>}
          </div>
          <hr className="my-4 border-gray-200 dark:border-muted" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500">Payment Amount</p>
                    <span className="text-sm">{totalAmount}</span>
                  </div>
                  {paymentMethod && <div>
                    <p className="text-sm text-blue-500">Payment Method</p>
                    { !isEditable ?
                    <>
                      <span className="text-sm">{paymentMethod}</span>
                    </>
                      :
                    <>
                      <Input type="text" id="name" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-[170px] border-0 p-0 px-1 bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 " 
                      />
                    </>
                    }
                  </div>}                  
                </div>
                <div className="space-y-3">
                   
                  <p className="text-sm text-blue-500">Payment Remaining</p>
                  <span className="text-sm">{(totalAmount ? totalAmount : 0) - (advancePayment ? advancePayment : 0)}</span> 
                  {advancePayment && <div>
                    <p className="text-sm text-blue-500">Payment Done</p>
                    { !isEditable ?
                    <>
                      <span className="text-sm">{advancePayment}</span>
                    </>
                      :
                    <>
                      <Input type="text" id="number" value={advancePayment} onChange={(e) => setAdvancePayment(Number(e.target.value))}
                        className="w-[170px] border-0 p-0 my-0 px-1 bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        " />
                    </>
                    }
                  </div>}
                </div>
          </div>
      </div>
      {booking.odometerReading &&
      <div className="px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
          <h3 className="text-lg font-semibold mb-4 ">Some more details</h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              {booking.odometerReading &&<div>
                <p className="text-sm text-blue-500">Odometer Reading</p>
                <span className="text-sm">{booking.odometerReading}</span>
              </div>}
              {booking.documents &&<div>
                <div className="flex gap-1 items-center">
                  <p className="text-sm text-blue-500">Customer Aadhar Card and Driving License</p>
                  {isEditable && <Button className="cursor-pointer bg-gray-200 dark:bg-muted dark:text-white text-black hover:bg-gray-300 dark:hover:bg-secondary hover:bg-opacity-30" onClick={() => {
                    setAction("delete the documents of");
                    setIsDialogOpen(true);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>}
                </div>
                <div className="mt-2 text-sm">
                  {booking.documents.map((file, index) => (
                    <Link
                      href={file.url}
                      key={index}
                      className="flex w-fit cursor-pointer max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="min-w-4">
                        {getFileIcon(file.type)}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{file.name}</span>
                    </Link>
                  ))}
                </div>
              </div>}
              
              {booking.selfieUrl &&<div>
                <p className="text-sm text-blue-500">Selfie with car</p>
                  <Link
                      href={booking.selfieUrl}
                      className="flex w-fit cursor-pointer max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="min-w-4">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">Car Selfie</span>
                    </Link>
              </div>}
            </div>
            <div className="space-y-2">
              {booking.notes &&<div>
                <p className="text-sm text-blue-500">Notes if any</p>
                <span className="text-sm">{booking.notes}</span>
              </div>}
              
              {booking.carImages && booking.carImages.length >0 && <div>
                <div className="flex gap-1 items-center">
                  <p className="text-sm text-blue-500">Photos Before pick-up</p>
                  {isEditable && <Button className="cursor-pointer bg-gray-200 dark:bg-muted dark:text-white text-black hover:bg-gray-300 dark:hover:bg-secondary hover:bg-opacity-30" onClick={() => {
                    setAction("delete the car photos of");
                    setIsDialogOpen(true);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>}
                </div>
                <div className="mt-2 text-sm">
                  {booking.carImages.map((file, index) => (
                    <Link
                      href={file.url}
                      key={index}
                      className="flex w-fit cursor-pointer max-w-[200px] max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="min-w-4">
                      <ImageIcon className="w-4 h-4" />
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">{file.name}</span>
                    </Link>
                  ))}
                </div>
              </div>}
              
            </div>
          </div>
      </div>
      }
      {!isEditable && <div className=" flex justify-center space-x-2 mt-2">
        {bookingStatus === "Upcoming" &&
        <Button className="px-4 py-4 max-sm:w-full bg-blue-600 dark:text-black text-blue-100  shadow-lg"
          onClick={() => {
            setAction("Start");
            setIsDialogOpen(true)
          }}>
          <span className="" >Start Booking</span> 
        </Button>
        }
        {bookingStatus === "Ongoing" &&
        <Button className="px-4 py-4 max-sm:w-full bg-blue-600 dark:text-black text-blue-100  shadow-lg"
        onClick={() => {
          setAction("Stop");
          setIsDialogOpen(true);
        }}>
          <span className="">Stop Booking</span> 
        </Button>}
      </div>}
      {isEditable && <div className=" flex justify-center space-x-2 mt-2">
        <>
          <Button className="px-4 py-4 max-sm:w-full bg-primary hover:bg-opacity-50 shadow-lg"
          onClick={() => {
            setAction("Update");
            setIsDialogOpen(true);
          }}>
            <span className="">Update</span> 
          </Button>
          <Button className="px-4 py-4 max-sm:w-full bg-primary hover:bg-opacity-50 shadow-lg"
          onClick={handleCancel}>
            <span className="">Cancel</span> 
          </Button>

        </>
      </div>}
        <ActionDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} action={action} handleAction={handleAction}/>
    </div>
  )
}

