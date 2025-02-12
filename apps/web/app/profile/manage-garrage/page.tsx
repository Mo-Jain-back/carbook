"use client"
import Link from "next/link";
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackArrow from "@/public/back-arrow.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import LoadingScreen from "@/components/loading-screen";
import { Car } from "@/lib/store";


const page = () => {
  const [cars,setCars] = useState<Car[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/car/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
        setCars(res.data.cars);

      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[])

  if(!cars) {
    return <LoadingScreen/>;
  }

  return (
    <div className="py-6 px-4 h-screen dark:bg-muted ">
            <div className="w-full flex gap-6  items-start">
              <Button 
                onClick={() => router.push('/profile')}
                className=" mt-2 flex bg-transparent shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card ">
                    <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
              </Button>
              <div className="flex justify-start sm:mt-2 mt-[4px] items-center mb-8 ">
                  <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                  }} className="text-3xl max-sm:text-xl font-black text-black dark:text-white font-myfont">MANAGE YOUR GARRAGE</h1>
                  
              </div>
            </div>
          
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <Link
                      href={`/car/${car.id}`}
                      key={car.id}
                      className="transform transition-all duration-300 hover:scale-105"
                  >
                    <Card className="w-full border-0">
                        <CardContent className="p-2 border-0 dark:bg-card bg-blue-100  rounded-md cursor-pointer">
                            <div className="flex sm:flex-col flex-row justify-around sm:px-1 px-8">
                            <div className="relative sm:w-full w-2/3 sm:h-48">
                                <Image
                                src={car.imageUrl || "/placeholder.svg"}
                                alt={car.brand + " " + car.model}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-lg border-gray-400 dark:border-background border-[1px]  "
                                />
                            </div>
                            <div className="p-4 w-full flex sm:justify-center justify-end items-center"
                                onClick={() => router.push(`/magane-garrage/${car.id}`)}>
                                <Edit className="w-4 h-4 text-black dark:text-white mx-2"/>
                                <h3 className="text-lg max-sm:text-sm font-semibold text-black dark:text-white">{car.brand + " " + car.model}</h3>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                </Link>
                ))}
            </div>
        </div>
  )
};

export default page;
