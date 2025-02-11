import {  Router } from "express";
import {  CalendarUpdateSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";
import { start } from "node:repl";

export const calendarRouter = Router();

calendarRouter.get("/all",middleware,async (req,res) => {
    try {
        const bookings = await client.booking.findMany({
            where: {
                userId: req.userId!
            },
            include:{
                car:true
            }
        })
        const formatedBookings = bookings.map(booking => {
            return {
                id:booking.id,
                startDate:booking.startDate,
                endDate:booking.endDate,
                status:booking.status,
                startTime:booking.startTime,
                endTime:booking.endTime,
                color:booking.car.colorOfBooking,
                allDay:booking.allDay,
                customerName:booking.customerName,
                customerContact:booking.customerContact,
                carId:booking.carId,
                carName:booking.car.brand + " " + booking.car.model,
            }
        })
        res.json({
            message:"Bookings fetched successfully",
            bookings:formatedBookings
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})


calendarRouter.put("/:id", middleware, async (req, res) => {
    const parsedData = CalendarUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Wrong Input type" });
        return;
    }

    try {
        const booking = await client.booking.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            },
            include: {
                car: true,
            },
        });

        if (!booking) {
            res.status(400).json({ message: "Booking not found" });
            return;
        }

        const updateData: Record<string, any> = {};

        if (parsedData.data.startDate !== undefined) updateData.startDate = parsedData.data.startDate;
        if (parsedData.data.endDate !== undefined) updateData.endDate = parsedData.data.endDate;
        if (parsedData.data.startTime !== undefined) updateData.startTime = parsedData.data.startTime;
        if (parsedData.data.endTime !== undefined) updateData.endTime = parsedData.data.endTime;
        if (parsedData.data.allDay !== undefined) updateData.allDay = parsedData.data.allDay;

        await client.booking.update({
            data: updateData,
            where: {
                id: parseInt(req.params.id),
            },
        });

        res.json({
            message: "Booking updated successfully",
            BookingId: booking.id,
        });
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});


calendarRouter.delete("/:id",middleware,async (req,res) => {
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            },
            include:{
                car:true
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        await client.booking.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({
            message:"Booking deleted successfully",
            BookingId:booking.id
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

calendarRouter.put("/change-color/:id",middleware,async (req,res) => {
    try {
        const car = await client.car.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        if(!car) {
            res.status(400).json({message: "Car not found"})
            return
        }

        await client.car.update({
            data: {
                colorOfBooking: req.body.color
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({
            message:"Booking color updated successfully",
            CarId:car.id
        })    
    }
    catch(e) {
        res.status(400).json({message: "Internal server error"})
    }    
})