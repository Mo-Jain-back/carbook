"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Clock, Plus, Fuel, X, Palette } from "lucide-react"
import { CarCard } from "./car-card"
import Link from "next/link";
import { cn } from "@/lib/utils"

const userCars = [
    {
      id: 1,
      name: "Tesla Model 3",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=1200",
      bookings: [
        { start: "2023-06-01", end: "2023-06-03" },
        { start: "2023-06-10", end: "2023-06-15" },
      ],
    },
    {
      id: 2,
      name: "Ford Mustang",
      imageUrl: "https://platform.cstatic-images.com/in/v2/stock_photos/602375aa-858e-4b71-a9eb-f77ca929c9d0/2fb5b283-ca73-41c1-812d-151a80af3953.png",
      bookings: [
        { start: "2023-06-05", end: "2023-06-07" },
        { start: "2023-06-20", end: "2023-06-25" },
      ],
    },
    {
      id: 3,
      name: "Toyota Camry",
      imageUrl: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg",
      bookings: [
        { start: "2023-06-08", end: "2023-06-09" },
        { start: "2023-06-18", end: "2023-06-22" },
      ],
    },
  ]

export function AddCarDialog() {
    
  const [isOpen,setIsOpen] = useState(false);
  const [price,setPrice] = useState("");
  const [cars,setCars] = useState(userCars);
  const [mileage,setMileage] = useState("");
  const [carBrand,setCarBrand] = useState<string>("");
  const [carModel,setCarModel] = useState<string>("");
  const [color,setColor] = useState<string>("#0000FF");
  const [carNumber,setCarNumber] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const carslength = cars.length;
    const car = {
      id: carslength + 1,
      name: carBrand +  " " + carModel,
      imageUrl: selectedImage || "",
      bookings: [],
    };
    setCars([...cars, car]);
    setCarBrand("");
    setCarModel("");
    setColor("#0000FF");
    setCarNumber("");
    setPrice("");
    setMileage("");
    setSelectedImage(null); 
    setImageFile(null);
    setIsOpen(false);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  }

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageFile(null);
  }

  return (
    <>
        <section className="py-6 bg-gray-100 px-4">
            <div className="flex justify-between items-center mb-8 px-4">
                <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                 }} className="text-3xl font-black text-black font-myfont">MOHIT's GARRAGE</h1>
                <Button className="bg-black hover:bg-blue-100 hover:text-black text-blue-100 hover:border hover:border-black  shadow-lg"
                  onClick={() => setIsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4 " />
                  <span className="">Add Car</span> 
                </Button>
            </div>
            <div className="grid z-[-1] sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                <Link
                    href={`/car/${car.id}`}
                    key={car.id}
                    className="transform transition-all duration-300 hover:scale-105"
                >
                    <CarCard name={car.name} imageUrl={car.imageUrl} />
                </Link>
                ))}
            </div>
        </section>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-auto overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>
                        <div></div>
                    </DialogTitle>
                </DialogHeader>
                <div className="text-[50px] font-bold">
                    <Input
                    type="text"
                    name="title"
                    value={carBrand} 
                    onChange={(e) => setCarBrand(e.target.value)}
                    placeholder="Add Car Brand"
                    className="my-4 rounded-none placeholder:text-[30px] text-[30px] md:text-[30px] file:text-[30px] placeholder:text-gray-700 border-0 border-b text-2xl focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                    />
                </div>
                
                <div className="gap-4 w-10/11">
                        <div className="flex justify-between gap-6 items-center">
                            <Car className="w-5 h-5 flex-shrink-0" />
                            <Input
                                type="text"
                                name="title"
                                placeholder="Add Car Model"
                                value={carModel} 
                                onChange={(e) => setCarModel(e.target.value)}
                                className="my-4 w-full rounded-none placeholder:text-[14px] text-[14px] md:text-[14px] placeholder:text-gray-700 border-0 border-b text-2xl focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Input
                                type="text"
                                name="title"
                                placeholder="Add Car Number"
                                value={carNumber} 
                                onChange={(e) => setCarNumber(e.target.value)}
                                className="my-4 w-full rounded-none placeholder:text-[14px] text-[14px] md:text-[14px] placeholder:text-gray-700 border-0 border-b text-2xl focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            
                        </div>
                        <div className="flex justify-between items-center gap-6 items-end">
                            <Palette className="w-5 h-5 flex-shrink-0" />
                            <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                              <Label htmlFor="color" >
                                Select color for booking
                              </Label>
                              <div className="w-2/3 flex  items-center">
                                <div
                                  className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
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
                            <div className=" w-full">
                                <Label htmlFor="carImage" className="cursor-pointer">Upload image</Label>
                                <div onClick={() => {
                                  document.getElementById('carImage')?.click()
                                  setIsOpen(true);
                                  }} className=" mx-3 bg-gray-300 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors">
                                  <span>Choose file</span>
                                </div>
                                <Input
                                    id="carImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    // className={cn("border-0 cursor-pointer overflow-hidden text-ellipsis border-b-gray-400 rounded-none border-b border-black p-0 focus:border-blue-500 focus:ring-0", "transition-colors duration-200")}
                                />
                            </div>
                        </div>
                </div>

                <div className="flex items-center gap-0 w-full">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Clock className="h-5 w-5 flex-shrink-0" />
                            <Label htmlFor="price" className="w-1/3">
                            24 hr price
                            </Label>
                            <Input type="text" id="price" placeholder="0"
                                className="w-1/3 border-black placeholder:text-gray-700 focus:border-blue-400 focus-visible:ring-blue-400" 
                                value={price} 
                                onChange={(e) => setPrice((e.target.value))}
                            />
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <Fuel className="h-5 w-5 flex-shrink-0" />
                            <Label htmlFor="totalAmount" className="w-1/3">
                            Car Mileage
                            </Label>
                            <Input type="text" id="totalAmount" placeholder="0"
                                value={mileage} 
                                onChange={(e) => setMileage((e.target.value))}
                                className="w-1/3 placeholder:text-gray-700 border-black focus:border-blue-400 focus-visible:ring-blue-400 " />
                        </div>
                    </div>
                    <div className="w-[140px] h-[100px] border border-black relative">
                        {selectedImage && (
                            <>
                                <img 
                                    src={selectedImage} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <Button type="submit" className="text-blue-100 bg-black hover:border border-black hover:bg-blue-50 hover:text-black w-full">
                    Create
                </Button>
            </form>
        </DialogContent>
        </Dialog>
    </>
  )
}