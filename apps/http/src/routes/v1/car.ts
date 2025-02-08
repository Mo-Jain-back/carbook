import {  Router } from "express";
import { CarsSchema, CarsUpdateSchema } from "../../types";
import client from "@repo/db/client";
import { middleware } from "../../middleware";

export const carRouter = Router();

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
        const cars = await client.car.findMany();
        const formatedCars = cars.map(car => {
            return {
                id:car.id,
                brand:car.brand,
                model:car.model,
                plateNumber:car.plateNumber,
                imageUrl:car.imageUrl
            }
        })
        res.json({
            message:"Cars fetched successfully",
            formatedCars
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

carRouter.get("/:id",middleware,async (req,res) => {
    try {
        const car = await client.car.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        })
        if(!car) {
            res.status(400).json({message: "Car not found"});
            return
        }
        res.json({
            message:"Car fetched successfully",
            car
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"});
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
                id: parseInt(req.params.id)
            }
        })

        if(!car) {
            res.status(400).json({message: "Car not found"})
            return
        }

        console.log("parsed data", parsedData.data)
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
                id: parseInt(req.params.id)
            }
        })

        if(!car) {
            res.status(400).json({message: "Car not found"})
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
