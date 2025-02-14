"use client"
import { BASE_URL } from "@/lib/config";
import { useCarStore, useUserStore } from "@/lib/store";
import axios from "axios";
import React, { useEffect } from "react"
import SplashScreen from "./SplashScreen";
import InitiateScreen from "./InitiateScreen";

const Initiate = () => {
    const {setName,setImageUrl} = useUserStore();
    const {setCars} = useCarStore();
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
                try{
                const res = await axios.get(`${BASE_URL}/api/v1/me/name`,{
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setName(res.data.name);
                setImageUrl(res.data.imageUrl);
                const res1 = await axios.get(`${BASE_URL}/api/v1/car/all`, {
                    headers: {
                      authorization: `Bearer ` + localStorage.getItem('token')
                      }
                    })
                setCars(res1.data.cars);
                }
                catch(error){
                    console.log(error);
                }
            }
            setIsLoading(false);
            fetchData();
    }, []);

    if(!isLoading) return <SplashScreen/>
    return <InitiateScreen/>
};

export default Initiate;
