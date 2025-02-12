"use client";

import React, { use, useEffect } from "react"

const InitiateCalendar = () => {
    useEffect(() => {
        const fetchData = async () => {
                try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/all`, {
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log(res);
                }
                catch(error){
                    console.log(error);
                }
            }
            fetchData();
    }, []);
  return null
};

export default InitiateCalendar;
