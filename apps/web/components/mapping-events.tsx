"use client"
import { BASE_URL } from "@/lib/config";
import { CalendarEventType, useEventStore } from "@/lib/store";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function MappingEvents() {
      const {setEvents} = useEventStore();
      const [eventsData, setEventsData] = useState<CalendarEventType[]>([]);
      
      useEffect(() => {
        const fetchData = async () => {
          try{
            const res = await axios.get(`${BASE_URL}/api/v1/calendar/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
                }
              })
              setEventsData(res.data.bookings);
            }
          catch(error){
            console.log(error);
          }
        };
        fetchData();
      }, []);
      
      
      useEffect(() => {
        const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
          id: event.id,
          startDate: dayjs(event.startDate),
          status: event.status,
          startTime: event.startTime,
          endDate: dayjs(event.endDate),
          endTime: event.endTime,
          color:event.color,
          allDay: event.allDay,
          customerName: event.customerName,
          customerContact: event.customerContact,
          carId: event.carId,
          carName: event.carName,
        }));
    
        setEvents(mappedEvents);
      }, [eventsData, setEvents]);
    
     return null;   
}