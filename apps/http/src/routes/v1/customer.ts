import {  Router } from "express";
import client from "@repo/db/client";
import { middleware } from "../../middleware";
import { CustomerUpdateSchema } from "../../types";

export const customerRouter = Router();

customerRouter.get("/all",middleware,async (req,res) => {
    try {
        const customers = await client.customer.findMany();
        res.json({
            message:"Customer fetched successfully",
            customers:customers
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

customerRouter.put("/:id", middleware,async (req,res) => {
    const parsedData = CustomerUpdateSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Wrong Input type"})
        return
    }
    try {
        const customer = await client.customer.findFirst({
            where: {
                id: parseInt(req.params.id),
            },
            include:{
                documents:true
            }
        })

        if(!customer) {
            res.status(400).json({message: "Customer not found"})
            return
        }

        const updateData: Record<string, any> = {};
        const updateDocumentsData: Record<string, any> = {};

        if (parsedData.data.name !== undefined) updateData.name = parsedData.data.name;
        if (parsedData.data.contact !== undefined) updateData.contact = parsedData.data.contact;
        if (parsedData.data.address !== undefined) updateData.address = parsedData.data.address;
        if (parsedData.data.documents !== undefined) updateDocumentsData.documents = parsedData.data.documents;

        await client.customer.update({
            data: {
                name: parsedData.data.name,
                contact: parsedData.data.contact,
                address: parsedData.data.address,
                folderId: parsedData.data.folderId,
            },
            where: {
                id: customer.id
            }
        })

        await client.documents.deleteMany({
            where: {
                customerId: customer.id
            }   
        });

        if(parsedData.data.documents){  
            for (const document of parsedData.data.documents) {
                await client.documents.create({
                    data: {
                        name: document.name,
                        url: document.url,
                        type: document.type,
                        customerId: customer.id
                    }
                })
            }
        }

        res.json({
            message:"Customer updated successfully",
            CustomerId:customer.id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})

customerRouter.delete("/:id",middleware,async (req,res) => {
    try {
        const customer = await client.customer.findFirst({
            where: {
                id: parseInt(req.params.id),
            },
            include:{
                documents:true
            }
        })

        if(!customer) {
            res.status(400).json({message: "Customer not found"})
            return
        }

        await client.customer.delete({
            where: {
                id: customer.id
            }
        })

        res.json({
            message:"Customer deleted successfully",
            CustomerId:customer.id
        })
    } catch(e) {
        console.error(e);

        res.status(400).json({message: "Internal server error"})
        
    }
})