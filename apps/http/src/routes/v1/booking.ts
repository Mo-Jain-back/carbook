import {  Router } from "express";
import { BookingEndSchema, BookingSchema, BookingStartSchema, BookingUpdateSchema, MultipleBookingDeleteSchema, MultipleBookingSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";
import { createFolder, deleteFolder } from "./folder";
import dotenv from "dotenv";
import { ParsedQs } from 'qs';

dotenv.config();

export function calculateCost(startDate:Date, endDate:Date, startTime:string, endTime:string, pricePer24Hours:number) {
        const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
  
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
  
    let timeDifference = endDateTime.getTime() - startDateTime.getTime();
    let hoursDifference = timeDifference / (1000 * 60 * 60);
    let cost = (hoursDifference / 24) * pricePer24Hours;
  
    return Math.floor(cost);
  }

  const generateBookingId = async () => {
    // Get the last booking entry
    const lastBooking = await client.booking.findFirst({
      orderBy: { id: 'desc' }, // Get the latest booking
    });
  
    let newId;
    if (!lastBooking) {
      newId = "JCR010001"; // Start from this if no bookings exist
    } else {
      // Extract numeric part from last ID
      const lastIdNumber = parseInt(lastBooking.id.replace("JCR01", ""), 10);
      newId = `JCR01${(lastIdNumber + 1).toString().padStart(4, "0")}`;
    }
  
    return newId;
  };

  const parseIds = (ids: string | ParsedQs | (string | ParsedQs)[]): string[] => {
    if (typeof ids === 'string') {
        return ids.split(',').map(id => id.trim());
    } else if (Array.isArray(ids)) {
        return ids.flatMap(id => typeof id === 'string' ? id.split(',').map(id => id.trim()) : []);
    }
    return [];
};

export const bookingRouter = Router();

bookingRouter.post("/",middleware,async (req,res) => {
    const parsedData = BookingSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        let customerId = parsedData.data.customerId;

        if(!customerId || customerId === 0) {
            const folder = await createFolder(parsedData.data.customerName+"_"+parsedData.data.customerContact,"customer");
            if(!folder.folderId || folder.error){
                res.status(400).json({
                    message: "Failed to create folder",
                    error:folder.error,
                })
                return
            }
            const customer = await client.customer.create({
                data: {
                    name: parsedData.data.customerName,
                    contact: parsedData.data.customerContact,
                    folderId:folder.folderId
                }
            })
            customerId = customer.id;
        }
        
        const newBookingId = await generateBookingId();
        const currDate = new Date();
        const unixTimeStamp = Math.floor(currDate.getTime() / 1000);
        const folder = await createFolder(newBookingId+" "+unixTimeStamp,"booking");


        if(!folder.folderId || folder.error){
            res.status(400).json({
                message: "Failed to create folder",
                error:folder.error,
            })
            return
        }

        const booking = await client.booking.create({
            data: {
                id: newBookingId,
                startDate: parsedData.data.startDate,
                endDate: parsedData.data.endDate,
                startTime: parsedData.data.startTime,
                endTime: parsedData.data.endTime,
                allDay: parsedData.data.allDay,
                carId: parsedData.data.carId,
                dailyRentalPrice: parsedData.data.dailyRentalPrice,
                totalEarnings:parsedData.data.totalAmount,
                userId: req.userId!,
                status:"Upcoming",
                customerId: customerId,
                bookingFolderId:folder.folderId
            }
        })
        
        res.json({
            message:"Booking created successfully",
            bookingId:booking.id,
            folderId:folder.folderId
        })
        return
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.get("/all",middleware,async (req,res) => {
    try {
        const bookings = await client.booking.findMany({
            where: {
                userId: req.userId!
            },
            include:{
                car:true,
                customer:true
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
                customerName:booking.customer.name,
                customerContact:booking.customer.contact,
                carColor:booking.car.colorOfBooking,
                odometerReading:booking.car.odometerReading
            }
        })
        res.json({
            message:"Bookings fetched successfully",
            bookings:formatedBookings
        })
        return
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.get("/:id",middleware,async (req,res) => {
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId!
            },
            include:{
                car:true,
                carImages:true,
                customer:{
                    include:{
                        documents:true
                    }
                }
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
            customerName:booking.customer.name,
            customerContact:booking.customer.contact,
            carId:booking.car.id,
            carName:booking.car.brand + " " + booking.car.model,
            carPlateNumber:booking.car.plateNumber,
            carImageUrl:booking.car.imageUrl,
            dailyRentalPrice:booking.dailyRentalPrice,
            securityDeposit:booking.securityDeposit,
            totalPrice:booking.totalEarnings,
            advancePayment:booking.advancePayment,
            customerAddress:booking.customer.address,
            paymentMethod:booking.paymentMethod,
            odometerReading:booking.odometerReading,
            endodometerReading:booking.endodometerReading,
            notes:booking.notes,
            selfieUrl:booking.selfieUrl,
            documents:booking.customer.documents,
            carImages:booking.carImages,
            customerId:booking.customerId,
            folderId:booking.customer.folderId,
            bookingFolderId:booking.bookingFolderId,
            currOdometerReading:booking.car.odometerReading
        }

        // Filter out null values dynamically
        const filteredBooking = Object.fromEntries(
            Object.entries(formatedBooking).filter(([_, value]) => value !== null)
        );
        res.json({
            message:"Booking fetched successfully",
            booking:filteredBooking
        })
        return
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.put("/delete-multiple",middleware,async (req,res) => {
    console.log('Request body:', req.body);

    const parsedData = MultipleBookingDeleteSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error('Validation error:', parsedData.error);
        res.status(400).json({ message: 'Wrong Input type' });
        return;
    }

    const { bookingIds } = parsedData.data;
    console.log('Parsed booking IDs:', bookingIds);

    try {
        for(const id of req.body.bookingIds){
            const booking = await client.booking.findFirst({
                where: {
                    id: id,
                    userId: req.userId!
                }
            })

            if(!booking) {
                res.status(400).json({message: "Booking not found"})
                return
            }

            await client.carImages.deleteMany({
                where:{
                    bookingId:id
                }
            })

            
            await client.booking.delete({
                where: {
                    id: id,
                    userId: req.userId!
                }
            })
            
            await deleteFolder(booking.bookingFolderId);
        }    
        res.json({
            message:"Booking deleted successfully",
        })
        return
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.put("/:id",middleware,async (req,res) => {
    console.log("hi there")
    const parsedData = BookingUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        const updateData: Record<string, any> = {};
        const updateCustomerData: Record<string, any> = {};

        if (parsedData.data.startDate !== undefined) updateData.startDate = parsedData.data.startDate;
        if (parsedData.data.endDate !== undefined) updateData.endDate = parsedData.data.endDate;
        if (parsedData.data.startTime !== undefined) updateData.startTime = parsedData.data.startTime;
        if (parsedData.data.endTime !== undefined) updateData.endTime = parsedData.data.endTime;
        if (parsedData.data.allDay !== undefined) updateData.allDay = parsedData.data.allDay;
        if (parsedData.data.carId !== undefined) updateData.carId = parsedData.data.carId;
        if (parsedData.data.securityDeposit !== undefined) updateData.securityDeposit = parsedData.data.securityDeposit;
        if (parsedData.data.dailyRentalPrice !== undefined) updateData.dailyRentalPrice = parsedData.data.dailyRentalPrice;
        if (parsedData.data.paymentMethod !== undefined) updateData.paymentMethod = parsedData.data.paymentMethod;
        if (parsedData.data.odometerReading !== undefined) updateData.odometerReading = parsedData.data.odometerReading;
        if (parsedData.data.notes !== undefined) updateData.notes = parsedData.data.notes;
        if (parsedData.data.selfieUrl !== undefined) updateData.selfieUrl = parsedData.data.selfieUrl
        updateData.totalEarnings = parsedData.data.totalAmount;

        if (parsedData.data.customerName !== undefined) updateCustomerData.name = parsedData.data.customerName;
        if (parsedData.data.customerAddress !== undefined) updateCustomerData.address = parsedData.data.customerAddress;
        if (parsedData.data.customerContact !== undefined) updateCustomerData.contact = parsedData.data.customerContact;

        if (updateCustomerData && booking.customerId) {
            await client.customer.update({
                where: { id: booking.customerId },
                data: {
                    ...updateCustomerData,
                },
            });
        }

        await client.booking.update({
            data: {
                ...updateData,
            }
            ,
            where: {
                id: booking.id
            }
        })

        if(parsedData.data.documents){
            for (const document of parsedData.data.documents) {
                await client.documents.create({
                    data: {
                        name: document.name,
                        url: document.url,
                        type: document.type,
                        customerId: booking.customerId
                    }
                })
            }
        }

        if(parsedData.data.carImages){
            for (const carImage of parsedData.data.carImages) {
                await client.carImages.create({
                    data: {
                        name: carImage.name,
                        url: carImage.url,
                        bookingId: booking.id
                    }
                })
            }
        }
        res.json({
            message:"Booking updated successfully",
            BookingId:booking.id
        })
        return
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.put("/:id/start",middleware,async (req,res) => {
    const parsedData = BookingStartSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error('Validation error:', parsedData.error);
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        await client.car.update({
            where: { id: booking.carId },
            data: {
                odometerReading: parsedData.data.odometerReading
            }
        });

        await client.customer.update({
            where: { id: booking.customerId },
            data: {
                name: parsedData.data.customerName,
                contact: parsedData.data.customerContact,
                address: parsedData.data.customerAddress
            }
        });

        const updatedBooking = await client.booking.update({
                                data: {
                                    carId: parsedData.data.selectedCar,
                                    startDate: parsedData.data.startDate,
                                    startTime: parsedData.data.startTime,
                                    endDate: parsedData.data.returnDate,
                                    endTime: parsedData.data.returnTime,
                                    securityDeposit: parsedData.data.securityDeposit,
                                    odometerReading: parsedData.data.odometerReading,
                                    advancePayment: parsedData.data.bookingAmountReceived,
                                    totalEarnings: parsedData.data.totalAmount,
                                    paymentMethod: parsedData.data.paymentMethod,
                                    notes: parsedData.data.notes,
                                    dailyRentalPrice: parsedData.data.dailyRentalPrice,
                                    status: "Ongoing",
                                    selfieUrl: parsedData.data.selfieUrl,
                                },
                                where: {
                                    id: req.params.id
                                }   
                            })  
        if(parsedData.data.documents){
            for (const document of parsedData.data.documents) {
                await client.documents.create({
                    data: {
                        name: document.name,
                        url: document.url,
                        type: document.type,
                        customerId: booking.customerId
                    }
                })
            }
        }

        for (const carImage of parsedData.data.carImages) {
            await client.carImages.create({
                data: {
                    name: carImage.name,
                    url: carImage.url,
                    bookingId: booking.id
                }
            })
        }
        
        res.json({
            message:"Booking started successfully",
            updatedStatus:updatedBooking.status
        })
        return
    }
    catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
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
                id: req.params.id,
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        
        const cost = calculateCost(new Date(booking.startDate),new Date(booking.endDate),booking.startTime,booking.endTime,booking.dailyRentalPrice);
        console.log("cost",cost );

        

        const updatedBooking =  await client.booking.update({
                                    data: {
                                        endDate: parsedData.data.endDate,
                                        endTime: parsedData.data.endTime,
                                        status: "Completed",
                                        endodometerReading: parsedData.data.odometerReading 
                                    },
                                    where: {
                                        id: req.params.id,
                                        userId: req.userId!
                                    }
                                });
        
                                console.log("booking updated");
        let increment = 0;

        if(updatedBooking.totalEarnings && updatedBooking.totalEarnings > 0){
            increment = updatedBooking.totalEarnings ;
        }

        await client.car.update({
            where:{
                id: updatedBooking.carId,
                userId: req.userId!
            },
            data:{
                totalEarnings:{
                    increment
                },
                odometerReading: parsedData.data.odometerReading
            }
        })
    
        
        res.json({
            message:"Booking ended successfully",
            updatedStatus:updatedBooking.status
        })
        return
    }
    catch(e) {   
        console.error(e);
        res.status(400).json({message: "Internal server error"})  
        return      
    }
});

bookingRouter.delete("/:id",middleware,async (req,res) => {
    try {
        const booking = await client.booking.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

        await client.carImages.deleteMany({
            where:{
                bookingId:req.params.id
            }
        })

        
        await client.booking.delete({
            where: {
                id: req.params.id,
                userId: req.userId!
            }
        })
        
        await deleteFolder(booking.bookingFolderId);
        
        res.json({
            message:"Booking deleted successfully",
            BookingId:booking.id
        })
        return
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
    }
})



bookingRouter.delete('/:id/car-images/all',middleware, async (req, res) => {
    const {id} = req.params;
    try {
        await client.carImages.deleteMany({
            where:{
                bookingId:id,
            }
        })
        res.status(200).json({
            message:"Car image deleted successfully",
            BookingId:id
        })
        return
    } catch(e) {
        console.error(e);
        res.status(400).json({message: "Internal server error"})
        return
    }
})

bookingRouter.post("/multiple",middleware, async (req, res) => {
    const parsedData = MultipleBookingSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }

    try{
        const dataSet = parsedData.data;

        const bookings: {
            id: string;
            startDate: string;
            endDate: string;
            startTime: string;
            endTime: string;
            status: string;
            carId: number;
            customerId: number;
            customerName: string;
            customerContact: string;
        }[] = [];

        for(const data of dataSet ){
            let customer = await client.customer.findFirst({
                where: {
                    name: data.customerName,
                    contact: data.customerContact
                }
            })

            if(!customer){
               
                const folder = await createFolder(data.customerName+"_"+data.customerContact,"customer");
                if(!folder.folderId || folder.error){
                    res.status(400).json({
                        message: "Failed to create folder",
                        error:folder.error,
                    })
                    return
                }
                customer = await client.customer.create({
                    data: {
                        name: data.customerName,
                        contact: data.customerContact,
                        address: data.customerAddress,
                        folderId:folder.folderId
                    }
                })
            }

            const newBookingId = await generateBookingId();
            const currDate = new Date();
            const unixTimeStamp = Math.floor(currDate.getTime() / 1000);
            const folder = await createFolder(newBookingId+" "+unixTimeStamp,"booking");

            if(!folder.folderId || folder.error){
                res.status(400).json({
                    message: "Failed to create folder",
                    error:folder.error,
                })
                return
            }

            let booking = await client.booking.create({
                data: {
                    id:newBookingId,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    allDay: data.allDay,
                    status: data.status,
                    carId: data.carId,
                    userId: req.userId!,
                    securityDeposit: data.securityDeposit,
                    dailyRentalPrice: data.dailyRentalPrice,
                    advancePayment: data.advancePayment,
                    totalEarnings: data.totalEarnings,
                    paymentMethod: data.paymentMethod,
                    odometerReading: data.odometerReading,
                    notes: data.notes,
                    customerId: customer.id,
                    bookingFolderId:folder.folderId
                }
            })
            bookings.push({
                id:newBookingId,
                startDate: data.startDate,
                endDate: data.endDate,
                startTime: data.startTime,
                endTime: data.endTime,
                status: data.status,
                carId: data.carId,
                customerId: customer.id,
                customerName: customer.name,                
                customerContact: customer.contact
            })
        }
        res.status(200).json({message: "Booking created successfully",bookings});
        return
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
        return
    }

})

bookingRouter.delete('/car-image/:id',middleware, async (req, res) => {
    try{
        await client.carImages.delete({
            where:{
                id:parseInt(req.params.id)
            }
        })
        res.status(200).json({
            message:"Car image deleted successfully",
            BookingId:req.params.id
        })
        return
    } catch(e) {
        console.error(e);
        res.json({message: "Internal server error"})
        return;
    }
})

bookingRouter.delete('/selfie-url/:id',middleware, async (req, res) => {
    try{
        await client.booking.update({
            where:{
                id:req.params.id
            },
            data:{
                selfieUrl:""
            }
        })
        res.status(200).json({
            message:"selfie deleted successfully",
            BookingId:req.params.id
        })
        return;
    } catch(e) {
        console.error(e);
        res.json({message: "Internal server error"})
        return;
    }
})
