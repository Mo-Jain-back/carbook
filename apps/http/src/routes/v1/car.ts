import {  Router } from "express";
import { CarsSchema, CarsUpdateSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";

export const carRouter = Router();

function calculateEarnings(bookings:any[]){
    const currDate = new Date();
    const oneWeekBeforeDate =  new Date(currDate.setDate(currDate.getDate() - 7));
    const oneMonthBeforeDate = new Date(currDate.setMonth(currDate.getMonth() - 1));
    const sixMonthBeforeDate = new Date(currDate.setMonth(currDate.getMonth() - 6));

    let oneWeekEarnings = 0;
    let oneMonthEarnings = 0;
    let sixMonthEarnings = 0;
    let totalEarnings = 0;
    for(const booking in bookings ){
        if(booking.startDate >= sixMonthBeforeDate){
            if(booking.startDate >= oneMonthBeforeDate){
                if(booking.startDate >= oneWeekBeforeDate){
                    oneWeekEarnings += booking.totalEarnings
                }
                oneMonthEarnings += booking.totalEarnings
            }
            sixMonthEarnings += booking.totalEarnings
        }
        totalEarnings += booking.totalEarnings
    }

    return {oneWeekEarnings,oneMonthEarnings,sixMonthEarnings,totalEarnings}

}

carRouter.post("/",middleware,async (req,res) => {
    const parsedData = CarsSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return;
    }
    try {
        const car = await client.car.create({
            data: {
                brand: parsedData.data.brand,
                model: parsedData.data.model,
                plateNumber: parsedData.data.plateNumber,
                colorOfBooking: parsedData.data.color,
                price: parsedData.data.price,
                mileage: parsedData.data.mileage,
                imageUrl: parsedData.data.imageUrl,
                userId: req.userId!
            }
        })
        res.json({
            message:"Car created successfully",
            carId:car.id
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

carRouter.get("/all",middleware,async (req,res) => {
    try {
        const cars = await client.car.findMany({
            where: {
                userId: req.userId!
            }
        });
        const formatedCars = cars.map(car => {
            return {
                id:car.id,
                brand:car.brand,
                model:car.model,
                plateNumber:car.plateNumber,
                imageUrl:car.imageUrl,
                colorOfBooking:car.colorOfBooking
            }
        })
        res.json({
            message:"Cars fetched successfully",
            cars:formatedCars
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

carRouter.get("/:id",middleware,async (req,res) => {
    try {
        const car = await client.car.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            },
            include:{
                bookings:true   
            }
        })
        if(!car) {
            res.status(404).json({message: "Car not found"});
            return
        }

        const formatedCars = {
            ...car,
            bookings:car.bookings.map(booking => {
                return {
                    id:booking.id,
                    start:booking.startDate,
                    end:booking.endDate,
                    status:booking.status,
                    customerName:booking.customerName,
                    customerContact:booking.customerContact,
                }
            })
        }
        res.json({
            message:"Car fetched successfully",
            car:formatedCars
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"});
    }
})

carRouter.get("/earnings/:id",middleware, async(req,res) => {
    try {
        const car = await client.car.findFirst({
            where: {
                id:parseInt(req.params.id),
                userId: req.userId!
            }
        }) 

        if(!car){
            res.status(404).json({message:"Car not found"})
        }

        const earnings = calculateEarnings(car.bookings);

        if(!earnings){
            res.status(400).json({message:"Error while finding earnings"})
        }

        res.json({
            message:"Car earnings fetched successfully",
            earnings
        })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({message: "Internal server error"})
    }
})

carRouter.put("/:id",middleware,async (req,res) => {
    const parsedData = CarsUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const car = await client.car.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        if(!car) {
            res.status(404).json({message: "Car not found"})
            return
        }

        await client.car.update({
            data: {
                colorOfBooking: parsedData.data.color,
                price: parsedData.data.price,
                mileage: parsedData.data.mileage,
                imageUrl: parsedData.data.imageUrl
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({
            message:"Car updated successfully",
            CarId:car.id
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})

carRouter.delete("/:id",middleware,async (req,res) => {
    try {
        const car = await client.car.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.userId!
            }
        })

        if(!car) {
            res.status(404).json({message: "Car not found"})
            return
        }

        await client.car.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.json({
            message:"Car deleted successfully",
            CarId:car.id
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
});
