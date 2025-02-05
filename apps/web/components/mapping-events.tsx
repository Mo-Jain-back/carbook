"use client"
import { CalendarEventType, useEventStore } from "@/lib/store";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function MappingEvents({
  eventsData,
}: {
  eventsData: CalendarEventType[];
}) {
     const {
         setEvents,
       } = useEventStore();
     
       useEffect(() => {
         const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
           id: event.id,
           startDate: dayjs(event.startDate),
           title: event.title,
           description: event.description,
           startTime: event.startTime,
           endDate: dayjs(event.endDate),
           endTime: event.endTime,
           allDay: event.allDay,
         }));
     
         setEvents(mappedEvents);
       }, [eventsData, setEvents]);
    
    
     return null;   
}