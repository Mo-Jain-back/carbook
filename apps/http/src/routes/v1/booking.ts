import {  Router } from "express";
import { BookingEndSchema, BookingSchema, BookingStartSchema, BookingUpdateSchema, MultipleBookingSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";

export function calculateCost(startDate:Date, endDate:Date, startTime:string, endTime:string, pricePer24Hours:number) {
    let startDateTime = new Date(startDate);
    let endDateTime = new Date(endDate);
  
    let [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);
  
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
            const customer = await client.customer.create({
                data: {
                    name: parsedData.data.customerName,
                    contact: parsedData.data.customerContact,
                }
            })
            customerId = customer.id;
        }
        
        const newBookingId = await generateBookingId();

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
                customerId: customerId
            }
        })
        
        res.json({
            message:"Booking created successfully",
            bookingId:booking.id
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
            notes:booking.notes,
            selfieUrl:booking.selfieUrl,
            documents:booking.customer.documents,
            carImages:booking.carImages,
            customerId:booking.customerId
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
        updateData.totalEarnings = parsedData.data.totalAmount;

        if (parsedData.data.customerName !== undefined) updateCustomerData.name = parsedData.data.customerName;
        if (parsedData.data.customerAddress !== undefined) updateCustomerData.address = parsedData.data.customerAddress;
        if (parsedData.data.customerContact !== undefined) updateCustomerData.contact = parsedData.data.customerContact;

        if (updateCustomerData && booking.customerId) {
            await client.customer.update({
                where: { id: booking.customerId },
                data: updateCustomerData,
            });
        }

        await client.booking.update({
            data: updateData
            ,
            where: {
                id: booking.id
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
                id: req.params.id,
                userId: req.userId!
            }
        })

        if(!booking) {
            res.status(400).json({message: "Booking not found"})
            return
        }

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
                                        status: "Completed"
                                    },
                                    where: {
                                        id: req.params.id,
                                        userId: req.userId!
                                    }
                                });
        
                                console.log("booking updated");
        
        if(updatedBooking.totalEarnings && updatedBooking.totalEarnings > 0){
            await client.car.update({
                where:{
                    id: updatedBooking.carId,
                    userId: req.userId!
                },
                data:{
                    totalEarnings:{
                        increment: updatedBooking.totalEarnings ,
                    }
                }
            })
        }
    
        
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
                id: req.params.id,
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

        res.json({
            message:"Booking deleted successfully",
            BookingId:booking.id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})

bookingRouter.delete('/:id/documents/all',middleware, async (req, res) => {
    const {id} = req.params;
    try {
        await client.documents.deleteMany({
            where:{
                customerId:parseInt(id),
            }
        })
        res.status(200).json({
            message:"Document deleted successfully",
            BookingId:id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
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
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
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

        for(const data of dataSet ){
            let customer = await client.customer.findFirst({
                where: {
                    name: data.customerName,
                    contact: data.customerContact
                }
            })

            if(!customer){
                customer = await client.customer.create({
                    data: {
                        name: data.customerName,
                        contact: data.customerContact,
                        address: data.customerAddress,
                    }
                })
            }

            const newBookingId = await generateBookingId();

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
                    customerId: customer.id
                }
            })
        }
        res.status(200).json({message: "Booking created successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }

})