import {  Router } from "express";
import { BookingEndSchema, BookingSchema, BookingStartSchema, BookingUpdateSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";

export const bookingRouter = Router();

bookingRouter.post("/",middleware,async (req,res) => {
    const parsedData = BookingSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const booking = await client.booking.create({
            data: {
                startDate: parsedData.data.startDate,
                endDate: parsedData.data.endDate,
                startTime: parsedData.data.startTime,
                endTime: parsedData.data.endTime,
                allDay: parsedData.data.allDay,
                carId: parsedData.data.carId,
                customerName: parsedData.data.customerName,
                customerContact: parsedData.data.customerContact,
                dailyRentalPrice: parsedData.data.dailyRentalPrice,
                totalEarnings:parsedData.data.totalAmount,
                userId: req.userId!,
                status:"Upcoming"
            }
        })
        
        res.json({
            message:"Booking created successfully",
            BookingId:booking.id
        })
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.get("/all",middleware,async (req,res) => {
    try {
        const bookings = await client.booking.findMany({
            where: {
                userId: req.userId!
            },
            include:{
                car:true
            },
            orderBy: [
                { startDate: 'asc' }, 
                { startTime: 'asc' } 
        ],
        })
        const formatedBookings = bookings.map(booking => {
            return {
                id:booking.id,
                start:booking.startDate,
                end:booking.endDate,
                startTime:booking.startTime,
                endTime:booking.endTime,
                status:booking.status,
                carId:booking.car.id,
                carName:booking.car.brand + " " + booking.car.model,
                carPlateNumber:booking.car.plateNumber,
                carImageUrl:booking.car.imageUrl,
                customerName:booking.customerName,
                customerContact:booking.customerContact,
                carColor:booking.car.colorOfBooking
            }
        })
        res.json({
            message:"Bookings fetched successfully",
            bookings:formatedBookings
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.get("/:id",middleware,async (req,res) => {
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
        
        const formatedBooking = {
            id:booking.id,
            start:booking.startDate,
            end:booking.endDate,
            startTime:booking.startTime,
            endTime:booking.endTime,
            status:booking.status,
            customerName:booking.customerName,
            customerContact:booking.customerContact,
            carId:booking.car.id,
            carName:booking.car.brand + " " + booking.car.model,
            carPlateNumber:booking.car.plateNumber,
            carImageUrl:booking.car.imageUrl,
            dailyRentalPrice:booking.dailyRentalPrice,
            securityDeposit:booking.securityDeposit,
            totalPrice:booking.totalEarnings,
            advancePayment:booking.advancePayment,
            customerAddress:booking.customerAddress,
            paymentMethod:booking.paymentMethod,
            drivingLicence:booking.drivingLicence,
            aadharCard:booking.aadharCard,
            odometerReading:booking.odometerReading,
            notes:booking.notes
        }

        // Filter out null values dynamically
        const filteredBooking = Object.fromEntries(
            Object.entries(formatedBooking).filter(([_, value]) => value !== null)
        );
        res.json({
            message:"Booking fetched successfully",
            booking:filteredBooking
        })
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.put("/:id",middleware,async (req,res) => {
    const parsedData = BookingUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
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

        const updateData: Record<string, any> = {};

        if (parsedData.data.startDate !== undefined) updateData.startDate = parsedData.data.startDate;
        if (parsedData.data.endDate !== undefined) updateData.endDate = parsedData.data.endDate;
        if (parsedData.data.startTime !== undefined) updateData.startTime = parsedData.data.startTime;
        if (parsedData.data.endTime !== undefined) updateData.endTime = parsedData.data.endTime;
        if (parsedData.data.allDay !== undefined) updateData.allDay = parsedData.data.allDay;
        if (parsedData.data.carId !== undefined) updateData.carId = parsedData.data.carId;
        if (parsedData.data.customerName !== undefined) updateData.customerName = parsedData.data.customerName;
        if (parsedData.data.customerAddress !== undefined) updateData.customerAddress = parsedData.data.customerAddress;
        if (parsedData.data.customerContact !== undefined) updateData.customerContact = parsedData.data.customerContact;
        if (parsedData.data.securityDeposit !== undefined) updateData.securityDeposit = parsedData.data.securityDeposit;
        if (parsedData.data.dailyRentalPrice !== undefined) updateData.dailyRentalPrice = parsedData.data.dailyRentalPrice;
        if (parsedData.data.paymentMethod !== undefined) updateData.paymentMethod = parsedData.data.paymentMethod;
        updateData.totalAmount = parsedData.data.totalAmount;

        await client.booking.update({
            data: updateData,
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({
            message:"Booking updated successfully",
            BookingId:booking.id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.put("/:id/start",middleware,async (req,res) => {
    const parsedData = BookingStartSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        const updatedBooking = await client.booking.update({
                                data: {
                                    customerName: parsedData.data.customerName,
                                    customerContact: parsedData.data.phoneNumber,
                                    carId: parsedData.data.selectedCar,
                                    startDate: parsedData.data.startDate,
                                    startTime: parsedData.data.startTime,
                                    endDate: parsedData.data.returnDate,
                                    endTime: parsedData.data.returnTime,
                                    securityDeposit: parsedData.data.securityDeposit,
                                    odometerReading: parsedData.data.odometerReading,
                                    customerAddress: parsedData.data.address,
                                    advancePayment: parsedData.data.bookingAmountReceived,
                                    dailyRentalPrice: parsedData.data.dailyRentalCharges,
                                    totalEarnings: parsedData.data.totalAmount,
                                    paymentMethod: parsedData.data.paymentMethod,
                                    notes: parsedData.data.notes,
                                    status: "Ongoing"
                                },
                                where: {
                                    id: parseInt(req.params.id)
                                }   
                            })  

        res.json({
            message:"Booking started successfully",
            updatedStatus:updatedBooking.status
        })
    }
    catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.put("/:id/end",middleware,async (req,res) => {
    const parsedData = BookingEndSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        const updatedBooking =  await client.booking.update({
                                    data: {
                                        endDate: parsedData.data.endDate,
                                        endTime: parsedData.data.endTime,
                                        totalEarnings: parsedData.data.totalAmount,
                                        status: "Completed"
                                    },
                                    where: {
                                        id: parseInt(req.params.id),
                                        userId: req.userId!
                                    }
                                });
        
        await client.car.update({
            where:{
                id: parseInt(req.params.id),
                userId: req.userId!
            },
            data:{
                totalEarnings:{
                    increment: parsedData.data.totalAmount || 0,
                }
            }
        })
        
        res.json({
            message:"Booking ended successfully",
            updatedStatus:updatedBooking.status
        })
    }
    catch(e) {   
        console.error(e);
     
        res.status(400).json({message: "Internal server error"})        
    }
});

bookingRouter.delete("/:id",middleware,async (req,res) => {
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
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        res.json({
            message:"Booking deleted successfully",
            BookingId:booking.id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})