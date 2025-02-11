"use client"
import { BASE_URL } from "@/lib/config";
import { useCarStore, useUserStore } from "@/lib/store";
import axios from "axios";
import React, { useEffect } from "react"

const Initiate = () => {
    const {setName,setImageUrl} = useUserStore();
    const {setCars} = useCarStore();

    useEffect(() => {
        try{
            const fetchData = async () => {
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
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    }, []);


    return null;
};

export default Initiate;
