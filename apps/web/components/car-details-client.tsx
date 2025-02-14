"use client"
import { Button } from "@/components/ui/button"
import {  Edit, IndianRupee, Loader2, LogOut, MoreVertical, PlaneTakeoff, Trash2 } from "lucide-react"
import Image from "next/image"
import {  useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import BackArrow from "@/public/back-arrow.svg";
import ArrowRight from "@/public/right_arrow.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import LoadingScreen from "./loading-screen"
import Booking from "@/public/online-booking.svg"
import { useCarStore } from "@/lib/store"
import ActionDialog from "./action-dialog"
import { uploadToDrive } from "@/app/actions/upload"

interface Car {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  colorOfBooking: string;
  imageUrl: string;
  mileage: number;
  price: number;
  totalEarnings: number;
  carFolderId: string;
  bookings: {
    id: number;
    start: string;
    end: string;
    status: string;
    customerName: string;
    customerContact: string;
  }[];
}
interface Earnings {
  thisMonth: number,
  oneMonth: number,
  sixMonths: number,
}


export function CarDetailsClient({ carId }: { carId: number }) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();
  const [isEditable,setIsEditable] = useState(false);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [color,setColor] = useState(car ? car.colorOfBooking : "#0000FF");
  const [price, setPrice] = useState(car?.price || 0);
  const [mileage, setMileage] = useState(car?.mileage || 0);
  const [imageUrl, setImageUrl] = useState(car?.imageUrl || "");
  const {cars,setCars} = useCarStore();
  const [earnings,setEarnings] = useState<Earnings>();
  const [action,setAction] = useState<string>("");
  const [actionDialogOpen,setActionDialogOpen] = useState(false);
  const [deleteBookingId,setDeleteBookingId] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  
  useEffect(() => {
    if(car) {
      setColor(car.colorOfBooking || "#0000FF");
      setPrice(car.price || 0);
      setMileage(car.mileage || 0);
      setImageUrl(car.imageUrl || "");
    }
  },[car]);

  useEffect(() => {
  
      const fetchData = async () => {
        try{
          const resCar = await axios.get(`${BASE_URL}/api/v1/car/${carId}`,{
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          setCar(resCar.data.car);
          const resEarnings = await axios.get(`${BASE_URL}/api/v1/car/earnings/${carId}`,{
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          setEarnings({
            ...resEarnings.data.earnings,
            total:resEarnings.data.total
          });
        }
        catch(error){
          console.log(error);
          router.push("/car-not-found");
        }
      }
      fetchData();
    
  },[]);

  if(!car) {
    return <div><LoadingScreen /></div>;
  }

  function handleAction() {
    
    if(action === "Delete" && deleteBookingId !== 0){
      handleDeleteBooking(deleteBookingId)
    }
    else if(action === "Update"){
      handleEdit();
    }
    return;
  }

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/car/${car.id}`,{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCars(cars.filter(car => car.id !== car.id));
      router.back();
    }
    catch(error){
      console.log(error);
    }
  }

  const handleEdit = async () => {
    // Implement edit functionality here
    console.log("Step 1")
    console.log("imageFile",imageFile);
    setIsLoading(true);
    let imageUrl: string | undefined = undefined;

  try {
    // Upload image only if imageFile is provided
    if (imageFile) {
      const resImage = await uploadToDrive(imageFile,"id",car.carFolderId);
      imageUrl = resImage.url;
    }
    console.log("Step 2");
    console.log("imageUrl",imageUrl);
    
    // Prepare data for update
    const updateData: Record<string, any> = {
      color: color,
      price: price,
      mileage: mileage,
    };

    // Only include imageUrl if a new image was uploaded
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }
    else{
      setImageUrl(car.imageUrl || "");
    }
    console.log("Step 3");
    console.log("updateData",updateData);

    await axios.put(`${BASE_URL}/api/v1/car/${car.id}`, updateData, {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

      const carId = car.id;
      setCars(cars.map(car => {
        if(car.id === carId){
          const newCar:typeof car = {
            ...car,
            colorOfBooking: color,
            price,
            ...(imageUrl && { imageUrl })
          }
          return newCar;
        }
        else{
          return car;
        }
      }));
      setIsLoading(false);
      setIsEditable(false);
    }
    catch(error){ 
      console.log(error);
      setIsLoading(false);
    }
  }

  
  const handleCancel = () => {
    setIsEditable(false);
    setColor(car.colorOfBooking || "#0000FF");
    setPrice(car.price || 0);
    setMileage(car.mileage || 0);
    setImageUrl(car.imageUrl || "");
  }


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return
      }
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }
  
  function getPickupTime(startTime: string) {
    const pickup = new Date(startTime)
    pickup.setMinutes(pickup.getMinutes() - 30)
    return formatDateTime(pickup.toISOString())
  }
  
  function getTimeUntilBooking(startTime: string) {
    const now = new Date()
    const start = new Date(startTime)
    const diffTime = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
    if (diffDays < 0) return "Trip has started"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day"
    return `${diffDays} days`
  }

  async function handleDeleteBooking(bookingId:number) {
    //add code to delete the booking
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/booking/${bookingId}`,{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCar((prev:Car | null) => {
        if(!prev) return prev;
        return {
          ...prev,
          bookings: prev.bookings.filter((booking) => booking.id !== bookingId)
        }
      })
      console.log(res.data);
    }
    catch(error){
      console.log(error);
    }
  }
  

  
  return (
    <div >
        <ActionDialog isDialogOpen={actionDialogOpen} setIsDialogOpen={setActionDialogOpen} action={action} handleAction={handleAction}/>

      <div className="flex items-center justify-between pb-2 border-b border-gray-300 dark:border-gray-700" >
          <div
            className="mr-2 rounded-md font-bold  cursor-pointer hover:bg-gray-200 dark:hover:bg-muted"
            onClick={() => router.push('/profile/manage-garrage')} 
          >
            <div className="h-12 w-12 flex justify-center items-center rounded-full  ">
              <div className="h-9 w-9 p-1 rounded-full" >
                <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
              </div>
            </div>
          </div>
         
        <div className="text-center w-5 h-5">
          
        </div>
        <div className="mr-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-muted p-2 rounded-sm" onClick={() =>  setIsDialogOpen(true)}>
          <Trash2 className=" h-6 w-6" />
        </div> {/* Spacer for alignment */}
      </div>

      <div >
        <div className="relative w-full max-w-[700px] max-sm:mb-32 my-2 h-[160px] sm:h-[300px] mx-auto">
          <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`${car.brand} ${car.model}`}
              width={2000}
              height={1000}
              className=" rounded-md mx-auto h-64 object-cover"
            />
          {isEditable && <button
             onClick={() => document.getElementById('carImage')?.click()}
            className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            <Edit size={20}  />
            <Input
                id="carImage"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                // className={cn("border-0 cursor-pointer overflow-hidden text-ellipsis border-b-gray-400 rounded-none border-b border-black p-0 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
            />
          </button>}
        </div>
        <div className="flex justify-center w-full">
          {!isEditable ? 
          <Button onClick={() => setIsEditable(true)} className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
            <Edit size={20} />
            <span>Edit Car Details</span>
          </Button>
          :
          <>
            <Button
              onClick={() => handleEdit()}
              className={`mx-3 flex items-center bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors ${isLoading && "cursor-not-allowed opacity-50"}`}>
                    {isLoading ?
                      <>
                      <Loader2 className="h-7 w-7 stroke-[3px] animate-spin text-white-500" />
                      <span>Please wait...</span>
                      </>
                    :
                    <span>Update</span>
                    }
            </Button>
            {!isLoading &&
              <Button onClick={() => handleCancel()} className="mx-3 bg-secondary text-secondary-foreground p-2 rounded-md hover:bg-secondary/90 transition-colors">
                <span>Cancel</span>
              </Button>
            }
          </>
          }
        </div>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="px-4 ">
            <section className="px-4 py-4 border-b-4 border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 ">Car Details</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <p className="text-sm text-blue-500 mb-1">Brand</p>
                  <span className="font-medium">{car.brand}</span> 
                  <p className="text-sm text-blue-500 mb-1">Model</p>
                  <span className="font-medium">{car.model}</span> 
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500">{!isEditable ? "Color of Bookings" : "Select the Color of Booking"}</p>
                    <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                      <div
                        className={`w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 ${isEditable ? "cursor-pointer" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => isEditable && document.getElementById("colorPicker")?.click()}
                      />
                      <Input
                        type="color"
                        id="colorPicker"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="hidden my-0"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-blue-500 mb-1">Plate Number</p>
                  <span className="font-medium">{car.plateNumber}</span> 
                </div>
                
              </div>
            </section>

            <section className="px-4 py-4 border-b-4 border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Performance & Pricing</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500 mb-1">24hr Price</p>
                    {!isEditable || !price ?
                    <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4"/> {car.price}</span> 
                    :
                    <Input type="number" id="name" value={price} 
                      onChange={(e) => setPrice(Number(e.target.value))} 
                      className="w-[170px] border-0 p-0 px-1 bg-gray-200 dark:bg-gray-800 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 " />
                    }
                  </div>
                  {earnings && earnings.oneMonth!=0 &&
                  <div>
                    <p className="text-sm text-blue-500 mb-1">1 month Earnings</p>
                    <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4"/> {earnings.oneMonth} </span> 
                  </div>}
                  <div>
                    <p className="text-sm text-blue-500 mb-1">Mileage</p>
                    {!isEditable || !mileage ?
                    <span className="font-medium">{car.mileage} km/ltr</span> 
                    :
                    <Input type="number" id="name" value={mileage} 
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-[170px] border-0 p-0 px-1 bg-gray-200 dark:bg-gray-800 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 " />
                    }
                  </div>
                </div>
                <div className="space-y-3">
                  {earnings && earnings.thisMonth != 0 && earnings.thisMonth &&
                    <div>
                      <p className="text-sm text-blue-500 mb-1">This Month Earnings</p>
                      <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4"/>{earnings.thisMonth}</span> 
                    </div>
                  }
                  {earnings && earnings.sixMonths != 0 && earnings.sixMonths &&
                    <div>
                      <p className="text-sm text-blue-500 mb-1">6 Month Earnings</p>
                      <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4"/>{earnings.sixMonths}</span> 
                    </div>
                  }
                  {car && car.totalEarnings != 0 && car.totalEarnings &&
                    <div>
                      <p className="text-sm text-blue-500 mb-1">Total Earnings</p>
                      <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4"/>{car.totalEarnings}</span> 
                    </div>
                  }
                </div>
              </div>
            </section>
            <section className="px-4 py-4 ">
              <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
              {car.bookings.length > 0 ?
                <div key={car.id} className=" gap-8 mb-4">
                {car.bookings.map((booking) => {
                  if(booking.status === 'Completed') return;
                  return(
                      <Card 
                      key={booking.id}
                       className="overflow-hidden hover:shadow-md dark:border-gray-700 transition-shadow my-2">
                        <CardContent className="p-0">
                          {/* Rest of the card content remains the same */}
                          <div className="flex justify-between items-center p-2 bg-muted">
                            <div className="">
                              <p className="text-sm max-sm:text-xs text-blue-500">Guest shall pickup car by</p>
                              <p className="font-semibold text-[#5B4B49] max-sm:text-sm dark:text-gray-400">{getPickupTime(booking.start)}</p>
                            </div>
                            <div className="flex items-center gap-2 justify-center">
                              <span className="text-blue-500">Go to Booking</span>
                              <LogOut 
                              onClick={() => router.push('/booking/'+booking.id)}
                              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-red-600 dark:hover:text-red-400" />
                            </div>
                          </div>
                          <hr className="border-t border-border" />
                          <div className="p-4 max-sm:p-2 bg-white dark:bg-background flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center sm:gap-8 gap-2">
                                <div>
                                  <p className="text-xs sm:text-sm text-blue-500">From</p>
                                  <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.start)}</p>
                                </div>
                                <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
                                <div>
                                  <p className="text-xs sm:text-sm text-blue-500">To</p>
                                  <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.end)}</p>
                                </div>
                              </div>
                              <div className="flex items-center w-full sm:w-4/5 justify-between mt-2 sm:mt-8 sm:gap-8 gap-2">
                                <div>
                                  <p className="text-xs sm:text-sm text-blue-500">Booked By</p>
                                  <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerName}</p>
                                </div>
                                <div>
                                  <p className="sm:text-sm text-xs text-blue-500">Contact</p>
                                  <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerContact}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center ml-4" onClick={() => {
                              setActionDialogOpen(true);
                              setDeleteBookingId(booking.id);
                            }}>
                              <Trash2 className="h-6 w-6 hover:text-red-500" />
                            </div>
                          </div>
                          <div className="p-4 max-sm:p-2 bg-gray-100 flex bg-muted items-center text-red-600 dark:text-red-400 gap-2">
                            <PlaneTakeoff className="h-4 w-4" />
                            <p className="text-sm max-sm:text-xs ">Trip start window opens in {getTimeUntilBooking(booking.start)}</p>
                          </div>
                        </CardContent>
                      </Card>
                  )})}
                </div>
                :
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-full h-full flex mt-4 flex-col justify-center items-center">
                    <Booking className={`h-12 w-12 stroke-[5px] fill-gray-400 `}/>
                    <p className="text-center text-xl text-gray-400 font-bold">No Bookings Yet</p>
                  </div>
                </div>
              }
            </section>
          </div>

    
      </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-muted border-border ">
              <DialogHeader>
                <DialogTitle>Delete</DialogTitle>
                <DialogDescription className="text-blue-500">
                  "Are you sure you want to Delete this car from garrage?" 
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
              <Button className="max-sm:w-full hover:bg-black bg-black hover:bg-opacity-80 text-white  shadow-lg" onClick={() => {
                  handleDelete();
                  setIsDialogOpen(false)
                }}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </div>
  )
}


