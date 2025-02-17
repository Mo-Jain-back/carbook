'use client'
import React, { useEffect, useState } from "react";
import ArrowRight from "@/public/right_arrow.svg";
import Booking from "@/public/online-booking.svg"
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { calculateCost } from "./add-booking";
import { toast } from "@/hooks/use-toast";

export interface Booking{
    id: string;
    carId: number;
    carImageUrl: string;
    carName: string;
    carPlateNumber: string;
    carColor:string;
    customerContact: string;
    customerName: string;
    end: string; // ISO 8601 date string
    start: string; // ISO 8601 date string
    startTime: string;
    endTime: string;
    status: string;
    action:string;
  }

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
}

const TakeAction = () => {
    const [bookings,setBookings] = useState<Booking[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        async function fetchData() {
          try {
            const res1 = await axios.get(`${BASE_URL}/api/v1/booking/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
                }
              })
            let tempBookings:Booking[] = [];
            const currDate = new Date();
            currDate.setMinutes(currDate.getMinutes() + 120);
            res1.data.bookings.forEach((booking:Booking) => {
                let startDateTime = new Date(booking.start);
                let endDateTime = new Date(booking.end);

                let [startHour, startMinute] = booking.startTime.split(':').map(Number);
                let [endHour, endMinute] = booking.endTime.split(':').map(Number);

                startDateTime.setHours(startHour, startMinute, 0, 0);
                endDateTime.setHours(endHour, endMinute, 0, 0);
              if(booking.status === "Upcoming" && startDateTime <= currDate){
                tempBookings.push({...booking, action:"Start"});
              }
              else if(booking.status === "Ongoing" && endDateTime <= currDate){
                tempBookings.push({...booking, action:"End"});
              }
            })
            setBookings(tempBookings);
    
          }
          catch (error) {
            console.log(error);
          }
        }
        fetchData();
      },[])

      const handleBookingStop = async (id:string) => {
        let booking = bookings.find(booking => booking.id === id);
        if(!booking) return;
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
         
          setBookings(prev => prev.filter(booking => booking.id !== id));
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
  return (
        <div className="w-full z-0 relative p-1 rounded-xl shadow-md bg-gray-200 dark:bg-[#161717] z-0 flex flex-col" >
            <div className="px-4 py-3 border-b border-gray-300 dark:border-border">
                <h3 className="font-semibold text-md">Take Action</h3>
            </div>
            <div className="  py-1 rounded-md   h-[300px] scrollbar-hide overflow-y-scroll  ">
                {bookings && bookings.length > 0 ?
                <div key={bookings.length} className="flex flex-col gap-1">
                {bookings.map((booking:Booking) => (
                    <div key={booking.id} className="flex items-center shadow-md justify-between w-full bg-muted gap-2 p-1 rounded-lg">
                        <div className="flex flex-col items-center">
                            <div style={{backgroundColor:booking.carColor}} className="sm:w-8 z-10 bg-green-200 flex-shrink-0 sm:h-8 w-6 h-6 rounded-md"/>
                            <p className="text-xs text-center w-[40px] overflow-hidden text-ellipsis">{booking.carName.split(' ')[0]}</p>
                        </div>
                        <div className="flex items-center w-full justify-between gap-1">
                            <div>
                                <p className="text-xs text-center px-4 text-blue-500">FROM</p>
                                <div className="w-full">
                                    <div className="font-semibold gap-x-1 w-fit text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs lg:text-sm dark:text-gray-400">
                                        <p className="whitespace-nowrap">{formatDate(booking.start)}</p>
                                        <p>{booking.startTime}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center ">
                                <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">{booking.customerName.split(' ')[0]}</div>
                                <ArrowRight className=" lg:w-12 w-8 stroke-0 fill-red-400 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] flex-shrink-0" />
                                <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">{booking.customerName.split(' ')[1]}</div>
                            </div>
                            <div>
                                <p className="text-xs text-center px-4 text-blue-500">TO</p>
                                <div className="w-full">
                                    <div className="font-semibold gap-x-1 text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs lg:text-sm dark:text-gray-400">
                                        <p className="whitespace-nowrap">{formatDate(booking.end)}</p>
                                        <p>{booking.endTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {booking.action === "Start" ?
                        <div 
                        onClick={() => router.push(`/booking/${booking.action.toLowerCase()}/form/${booking.id}`)}
                        className="rounded-full text-sm cursor-pointer bg-red-400 hover:bg-opacity-80 text-white py-1 px-2 sm:px-3">Start</div>
                        :
                        <div 
                        onClick={() => handleBookingStop(booking.id)}
                        className="rounded-full text-sm cursor-pointer bg-green-400 hover:bg-opacity-80 text-white py-1 px-2 sm:px-3">End</div>
                        }
                    </div>
                ))}
                </div>
                :
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <Booking className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}/>
                    <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">All Bookings are in time</p>
                </div>
                }   
            </div>
        </div>
            
  )
};

export default TakeAction;
