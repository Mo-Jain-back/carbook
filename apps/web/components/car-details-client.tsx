"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Edit, MoreVertical, PlaneTakeoff, Trash2 } from "lucide-react"
import Image from "next/image"
import {  useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  useState } from "react";
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"



interface CarDetailsClientProps {
  car: {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    imageUrl: string;
    mileage: string;
    price: string;
    bookings: {
      id: number;
      start: string;
      end: string;
      bookedBy: { name: string; contact: string },
      status: string;
    cancelledBy: null | string;
    }[];
  }
}



export function CarDetailsClient({ car }: CarDetailsClientProps) {
  const router = useRouter();
  const [isEditable,setIsEditable] = useState(false);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [color,setColor] = useState(car.color);
  const [price,setPrice] = useState(car.price);
  const [mileage,setMileage] = useState(car.mileage);
  const [imageUrl,setImageUrl] = useState(car.imageUrl);
  
  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Delete car:", car.id)
  }

  const handleEdit = () => {
    // Implement edit functionality here
    console.log("Edit car:", car.id);
    setIsEditable(false);
  }
  const handleCancel = () => {
    setIsEditable(false);
    setColor(car.color);
    setPrice(car.price);
    setMileage(car.mileage);
    setImageUrl(car.imageUrl);
  }

  const handleEditPhoto = () => {
    // Implement photo edit functionality here
    console.log("Edit photo for car:", car.id)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  function handleDeleteBooking() {
    //add code to delete the booking
    console.log("Delete booking:")
  }
  

  
  return (
    <div >
      <div className="flex items-center justify-between pb-2 border-b border-gray-300" >
          <div
            className="mr-2 p-2 rounded-md font-bold text-black cursor-pointer hover:text-white hover:bg-black"
            onClick={() => router.back()} 
          >
            <ArrowLeft className="h-6 w-6" />
          </div>
         
        <div className="text-center w-5 h-5">
          
        </div>
        <div className="mr-4 cursor-pointer hover:bg-gray-100 p-2 rounded-sm" onClick={() =>  setIsDialogOpen(true)}>
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
            onClick={handleEditPhoto}
            className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            <Edit size={20} onClick={() => document.getElementById('carImage')?.click()} />
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
            <Button onClick={() => handleEdit()} className=" mx-3 bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
              <span>Update</span>
            </Button>
            <Button onClick={() => handleCancel()} className="mx-3 bg-secondary text-secondary-foreground p-2 rounded-md hover:bg-secondary/90 transition-colors">
              <span>Cancel</span>
            </Button>
          </>
          }
        </div>
        <hr className="my-4 border-gray-200" />

          <div className="px-4 ">
            <section className="px-4 py-4 border-b-4 border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-black">Booking Details</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <p className="text-sm text-blue-500 mb-1">Brand</p>
                  <span className="font-medium">{car.brand}</span> 
                  <p className="text-sm text-blue-500 mb-1">Model</p>
                  <span className="font-medium">{car.model}</span> 
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-blue-500 mb-1">{!isEditable ? "Color of Bookings" : "Select the Color of Booking"}</p>
                  <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                    <div
                      className={`w-8 h-8 rounded-md border border-gray-300 ${isEditable ? "cursor-pointer" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => isEditable && document.getElementById("colorPicker")?.click()}
                    />
                    <Input
                      type="color"
                      id="colorPicker"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-blue-500 mb-1">Plate Number</p>
                  <span className="font-medium">{car.plateNumber}</span> 
                </div>
                
              </div>
            </section>

            <section className="px-4 py-4 border-b-4 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Performance & Pricing</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500 mb-1">24hr Price</p>
                    {!isEditable ?
                    <span className="font-medium"> {car.price}</span> 
                    :
                    <Input type="text" id="name" value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      className="w-[170px] border-0 p-0 px-1 bg-gray-200 focus-visible:ring-0 border-y-gray-200 border-y-4 focus:border-b-blue-400 " />
                    }
                  </div>
                  <div>
                    <p className="text-sm text-blue-500 mb-1">1 month Earnings</p>
                    <span className="font-medium"> 600 </span> 
                  </div>
                  <div>
                    <p className="text-sm text-blue-500 mb-1">Mileage</p>
                    {!isEditable ?
                    <span className="font-medium">{car.mileage} miles/charge</span> 
                    :
                    <Input type="text" id="name" value={mileage} 
                      onChange={(e) => setMileage(e.target.value)}
                      className="w-[170px] border-0 p-0 px-1 bg-gray-200 focus-visible:ring-0 border-y-gray-200 border-y-4 focus:border-b-blue-400 " />
                    }
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500 mb-1">1 Week Earnings</p>
                    <span className="font-medium">150</span> 
                  </div>
                  <div>
                    <p className="text-sm text-blue-500 mb-1">6 Month Earnings</p>
                    <span className="font-medium">3600</span> 
                  </div>
                </div>
              </div>
            </section>
            <section className="px-4 py-4 ">
              <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
              <div className=" gap-8 mb-4">
              {car.bookings.map((booking) => (
                  <Link href={`/booking/${booking.id}`} key={booking.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow my-2">
                      <CardContent className="p-0">
                        {/* Rest of the card content remains the same */}
                        <div className="p-4 bg-blue-100 bg-opacity-20">
                          <p className="text-sm text-blue-500">Guest shall pickup car by</p>
                          <p className="font-semibold text-[#5B4B49]">{getPickupTime(booking.start)}</p>
                        </div>
                        <hr className="border-t border-border" />
                        <div className="p-4 bg-white flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-8">
                              <div>
                                <p className="text-sm text-blue-500">From</p>
                                <p className="font-semibold text-[#5B4B49]">{formatDateTime(booking.start)}</p>
                              </div>
                              <ArrowRight className="mt-4" />
                              <div>
                                <p className="text-sm text-blue-500">To</p>
                                <p className="font-semibold text-[#5B4B49]">{formatDateTime(booking.end)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-center ml-4" onClick={handleDeleteBooking}>
                            <Trash2 className="h-6 w-6 hover:text-red-500" />
                          </div>
                        </div>
                        <div className="p-4 bg-gray-100 flex items-center text-red-600 gap-2">
                          <PlaneTakeoff className="h-4 w-4" />
                          <p className="text-sm">Trip start window opens in {getTimeUntilBooking(booking.start)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

    
      </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-white text-black">
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

