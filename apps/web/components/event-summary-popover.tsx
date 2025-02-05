"use client"

import type React from "react"
import { useState } from "react"
import { X, Edit2, Trash2, Users, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEventStore, type CalendarEventType } from "@/lib/store"
import { Input } from "@/components/ui/input"
import dayjs from "dayjs"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/datepicker";
import AddTime from "./add-time"

enum Status {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  inProgress = "inProgress",
  completed = "completed",
}
export const BookingStatusIcon  = ({ status,className }: { status?: Status; className?: string }) => {
  const statusIcons = {
    pending: <Clock className={`text-yellow-500 ${className}`} />,
    confirmed: <CheckCircle className={`text-green-500 ${className}`} />,
    cancelled: <XCircle className={`text-red-500 ${className}`} />,
    inProgress: <Loader2 className={`text-blue-500 animate-spin ${className}`} />,
    completed: <CheckCircle className={`text-green-500 ${className}`} />,
  };

  return status ? statusIcons[status] : <Clock className={`text-gray-500 ${className}`} />;
};
interface EventSummaryPopupProps {
  event: CalendarEventType
  isOpen: boolean
  onClose: () => void
}

export function EventSummaryPopup({ event, isOpen, onClose }: EventSummaryPopupProps) {
  const {events,setEvents} = useEventStore();
  const [isEditing, setIsEditing] = useState(false)
  const [startDate,setStartDate] = useState(event.startDate);
  const [endDate,setEndDate] = useState(event.endDate);
  const [startTime,setStartTime] = useState(event.startTime);
  const [endTime,setEndTime] = useState(event.endTime);
  const [bookedBy,setBookedBy] = useState("John Doe");
  const [color,setColor] = useState("#039BE5");
  const [car,setCar] = useState("Tesla Model 3");

  const handleDelete = () => {
    const updatedEvents = events.filter((e) => e.id !== event.id)
    setEvents(updatedEvents)
    onClose()
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = () => {
    const editedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      allDay: event.allDay,
    }
    const updatedEvents = events.map((e) => (e.id === event.id ? editedEvent : e))
    setEvents(updatedEvents)
    setIsEditing(false)
  }

  const handleDateChange = (date:Date,type?:string) => {
    if(type === "start") {
      setStartDate(dayjs(date))
    } else if(type === "end") {
      setEndDate(dayjs(date))
    }
  }

  return (
    <Dialog open={isOpen}  onOpenChange={onClose}>
      
      <DialogContent className="sm:max-w-[425px] max-sm:min-h-[70%] flex flex-col p-0 items-center ">
        <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
          <DialogTitle >
            <div className="flex justify-start w-full whitespace-nowrap mt-2">{event.title} Summary</div>
          </DialogTitle>
          <div className="flex justify-end w-full items-center w-full mr-4 mb-2">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        </DialogHeader>

        <div className="p-4 h-full w-full max-sm:mt-6">
        
          <div className="flex items-start space-x-4 w-[90%]">
            <div className={`w-6 h-6 rounded-md mt-2 ${isEditing ? "hidden" : ""}`} style={{ backgroundColor: color }} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Your booking starts from</h2>
              {isEditing ? (
                <div className="space-y-2 flex items-center justify-around max-h-[38px]">
                  <div className="mt-[7px]">
                    <DatePicker currDate={startDate} handleDateChange={handleDateChange} dateType="start"/>
                  </div>
                  {!event.allDay && (
                    <div className="mt-[-10px] mx-2">
                      <AddTime className="p-0 m-0 w-[50px] border-none bg-gray-200 hover:bg-gray-300 rounded-sm" selectedTime={startTime} setSelectedTime={setStartTime} />
                      <input type="hidden" name="time" value={startTime} />
                    </div>
                  )}
                  <div className="text-center mt-[-8px]"> -</div>
                  <div className="flex items-center justify-center mt-[-9px]">
                    <DatePicker  currDate={endDate} handleDateChange={handleDateChange} dateType="end"/>
                  </div>
                  {!event.allDay && (
                    <div className="mt-[-10px] mx-2">
                      <AddTime className="p-0 m-0 w-[50px] border-none bg-gray-200 hover:bg-gray-300 rounded-sm" selectedTime={endTime} setSelectedTime={setStartTime} />
                      <input type="hidden" name="time" value={endTime} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm">
                  {event.allDay
                    ? `${startDate.format("MMM D, YYYY")} - ${endDate.format("MMM D, YYYY")}`
                    : `${startDate.format("MMM D, YYYY")} ${startTime} - ${endDate.format("MMM D, YYYY")} ${endTime}`}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4 w-[90%]">
            <div className="flex items-start space-x-2">
              
              <Users className="h-5 w-5 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium">Booked by</p>
                {isEditing ? (
                  <Input
                    name="bookedBy"
                    value={bookedBy}
                    onChange={(e) => setBookedBy(e.target.value)}
                    className="bg-muted text-sm"
                  />
                ) : (
                  <p className="text-sm">{bookedBy}</p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Car className="h-5 w-5 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium">Car</p>
                <p className="text-sm">{car}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <BookingStatusIcon status={Status.pending} className="h-5 w-5 mt-1 mr-3" />
              <div>
                <p className="text-sm font-medium">Booking yet to Start</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4">
              <Button onClick={handleUpdate} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
