"use client";

import React, { use, useEffect } from "react"

const InitiateCalendar = () => {
    useEffect(() => {
        try{
            const fetchData = async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/all`, {
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log(res);
            }
            fetchData();
        }
        catch(error){
            console.log(error);
        }
    }, []);
  return null
};

export default InitiateCalendar;
