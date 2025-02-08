
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ENTERPRISE_FOLDER_ID, JWT_PASSWORD, USER_GUIDE_FOLDER_ID } from "../../config";
import { SigninSchema, SignupSchema } from "../../types";
import {hash, compare} from "../../scrypt";
import { middleware } from "./middleware";
import client from "@repo/db/client";


export const router = Router();

export const formatItem = (item: any, isFolder: boolean) => ({
    id: item.id,
    name: item.name,
    type: isFolder ? "folder" : item.type,
    items: isFolder ? item.subfolders.length + item.files.length + " items" : undefined,
    size: !isFolder ? item.size : undefined,
    modified: item.createdAt,
    isFavorite: item.isFavorite,
    contentType: item.contentType ?? undefined
});


router.post("/signup", async (req, res) => {
    console.log("inside signup")
    // check the user
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log("parsed data incorrect")
        res.status(400).json({message: "Validation failed"})
        return
    }

    try {
        const hashedPassword = await hash(parsedData.data.password)
        
        const user = await client.user.create({
            data: {
                usermail: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
            }
        })
        const token = jwt.sign({
            userId: user.id,
            name: user.name,
        }, JWT_PASSWORD);

        res.json({
            message:"User created successfully",
            token,
            username:user.usermail,
            name:user.name,
            userId:user.id
        })
    } catch(e) {
        console.log("error thrown")
        console.log(e)
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({message: "Validation failed"})
        return
    }

    try {
        const user = await client.user.findFirst({
            where: {
                usermail: parsedData.data.username
            }
        })
        
        if (!user) {
            res.status(403).json({message: "User not found"})
            return
        }
        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(403).json({message: "Invalid password"})
            return
        }

        const token = jwt.sign({
            userId: user.id,
            name: user.name,
        }, JWT_PASSWORD);

        res.json({
            message:"User signed in successfully",
            token,
            username:user.usermail,
            name:user.name,
            userId:user.id
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
        
    }
})

router.post("/cars",async (req,res) => {
    const parsedData = SigninSchema.safeParse(req.body)
})

