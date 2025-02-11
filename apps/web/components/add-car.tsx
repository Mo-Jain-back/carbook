"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import CarFrontIcon from "@/public/car-front.svg";
import Color from "@/public/color.svg";
import Price from "@/public/price-tag.svg";
import Speedometer  from "@/public/performance.svg";
import { BASE_URL } from "@/lib/config";
import axios from "axios"
import { Car, useCarStore } from "@/lib/store"

interface AddCarDialogProps {
  isOpen:boolean;
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddCarDialog({isOpen,setIsOpen}:AddCarDialogProps) {
    
  const [price,setPrice] = useState<number>(0);
  const [mileage,setMileage] = useState<number>(0);
  const [carBrand,setCarBrand] = useState<string>("");
  const [carModel,setCarModel] = useState<string>("");
  const [color,setColor] = useState<string>("#0000FF");
  const [carNumber,setCarNumber] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {cars,setCars} = useCarStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const body = {
          brand: carBrand,
          model: carModel,
          plateNumber: carNumber,
          color: color,
          price: price,
          mileage: mileage,
          imageUrl: selectedImage ? selectedImage : "",
        }
        const res = await axios.post(`${BASE_URL}/api/v1/car`,body, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
        const car = {
          id: res.data.carId,
          brand: carBrand,
          model: carModel,
          plateNumber: carNumber,
          imageUrl: selectedImage ? selectedImage : "",
          colorOfBooking:color
        };
        setCars([...cars,car]);
        setCarBrand("");
        setCarModel("");
        setColor("#0000FF");
        setCarNumber("");
        setPrice(0);
        setMileage(0);
        setSelectedImage(null); 
        setImageFile(null);
        setIsOpen(false);
      }
      catch (error) {
        console.log(error);
      }
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-auto overflow-y-auto dark:border-gray-800 ">
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
                    className="my-4 rounded-none placeholder:text-[30px] text-[30px] max-sm:placeholder:text-[24px]  md:text-[30px] file:text-[30px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                    />
                </div>
                
                <div className="gap-4 w-10/11">
                        <div className="flex justify-between gap-6 items-center">
                          <CarFrontIcon className="w-16 h-4 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" /> 
                            <Input
                                type="text"
                                name="title"
                                placeholder="Add Car Model"
                                value={carModel} 
                                onChange={(e) => setCarModel(e.target.value)}
                                className="my-4 w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] md:text-[14px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Input
                                type="text"
                                name="title"
                                placeholder="Add Car Number"
                                value={carNumber} 
                                onChange={(e) => setCarNumber(e.target.value)}
                                className="my-4 w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] md:text-[14px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            
                        </div>
                        <div className="flex justify-between items-center gap-6 items-end">
                            <Color className="w-16 h-16 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" /> 
                            <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                              <Label htmlFor="color" className="max-sm:text-xs">
                                Select color for booking
                              </Label>
                              <div className="w-2/3 flex  items-center">
                                <div
                                  className="w-8 h-8 rounded-md border border-gray-300 dark:border-black cursor-pointer"
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
                                <Label htmlFor="carImage" className="cursor-pointer max-sm:text-xs">Upload image</Label>
                                <div onClick={() => {
                                  document.getElementById('carImage')?.click()
                                  setIsOpen(true);
                                  }} className="  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors">
                                  <span>Choose file</span>
                                </div>
                                <Input
                                    id="carImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                </div>

                <div className="flex items-center gap-0 w-full">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Price className="w-7 h-7 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" /> 
                            <Label htmlFor="price" className="w-1/3 max-sm:text-xs">
                            24 hr price
                            </Label>
                            <Input type="number" id="price" placeholder="0"
                                className="w-1/3 border-black max-sm:text-xs dark:border-gray-700 placeholder:text-gray-700 dark:placeholder:text-gray-400  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                value={price} 
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <Speedometer className="w-7 h-7 dark:stroke-white dark:fill-white  stroke-black fill-black" /> 
                            <Label htmlFor="totalAmount" className="w-1/3 max-sm:text-xs">
                            Car Mileage
                            </Label>
                            <Input type="number" id="totalAmount" 
                                value={mileage} 
                                onChange={(e) => setMileage(parseInt(e.target.value))}
                                className="w-1/3 max-sm:text-xs placeholder:text-gray-700 dark:placeholder:text-gray-400  border-black dark:border-gray-700 focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none " />
                        </div>
                    </div>
                    <div className="w-[140px] h-[100px] border border-black dark:border-gray-700 relative">
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
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <Button type="submit" className="bg-blue-600 text-card hover:bg-opacity-80 w-full">
                    Create
                </Button>
            </form>
        </DialogContent>
        </Dialog>
    </>
  )
}