import { Button } from "@/components/ui/button"
import {  Edit, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import {  useRouter } from "next/navigation"
import { useEffect, useState } from "react";
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
  const [action,setAction] = useState<"Start"| "Stop" | "Delete" | "Update">("Start");
  const [name,setName] = useState<string>(booking.customerName);
  const [number,setNumber] = useState<string>(booking.customerContact);
  const [dailyRentalPrice,setDailyRentalPrice] = useState<number>(booking.dailyRentalPrice);
  const [paymentMethod,setPaymentMethod] = useState(booking.paymentMethod);
  const [advancePayment,setAdvancePayment] = useState(booking.advancePayment);
  const [totalAmount,setTotalAmount] = useState(booking.totalPrice);
  
  useEffect(() => {
    const cost = calculateCost(startDate,endDate,startTime,endTime,dailyRentalPrice);
    setTotalAmount(cost)
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
    return;
  }

  const handleBookingStop = async () => {
    let currDate = new Date();
  
    // Format back to HH:MM
    let newHours = currDate.getHours().toString().padStart(2, "0");
    let newMinutes = currDate.getMinutes().toString().padStart(2, "0");
    try {
      const newEndDate = new Date();
      const newEndTime = `${newHours}:${newMinutes}`;
      const cost = calculateCost(startDate,newEndDate,startTime,newEndTime,dailyRentalPrice);
      await axios.put(`${BASE_URL}/api/v1/booking/${booking.id}/end`, {
        endDate: new Date().toLocaleDateString('en-US'),
        endTime:`${newHours}:${newMinutes}`,
        totalAmount:cost
      },{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });
      setBookingStatus("Completed");
      setEndDate(newEndDate);
      setEndTime(newEndTime);
      router.push('/bookings');
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

  function handleClick() {
    //add code to stop or start the booking

    return;
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
      const res = await axios.delete(`${BASE_URL}/api/v1/booking/${booking.id}`,{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setBooking(undefined);
      router.push('/bookings');
      console.log(res.data);
    }
    catch(error){
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
    }
    catch(error){ 
      console.log(error);
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
            <div className="relative sm:w-24 flex items-center sm:h-20 rounded-md border border-border w-12 h-12 mb-2"> 
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
            {booking.securityDeposit &&<div>
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
                  <span className="text-sm">1200</span> 
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
            <div>
              {booking.aadharCard &&<div>
                <p className="text-sm text-blue-500">Customer Aadhar Card</p>
                <span className="text-sm">{booking.aadharCard}</span>
              </div>}
              {booking.odometerReading &&<div>
                <p className="text-sm text-blue-500">Odometer Reading</p>
                <span className="text-sm">{booking.odometerReading}</span>
              </div>}
            </div>
            <div>
              {booking.drivingLicence &&<div>
                <p className="text-sm text-blue-500">Customer Driving License</p>
                <span className="text-sm">{booking.drivingLicence}</span>
              </div>}
              {booking.notes &&<div>
                <p className="text-sm text-blue-500">Notes if any</p>
                <span className="text-sm">{booking.notes}</span>
              </div>}
            </div>
          </div>
      </div>
      }
      {!isEditable && <div className=" flex justify-center space-x-2 mt-2" onClick={handleClick}>
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

