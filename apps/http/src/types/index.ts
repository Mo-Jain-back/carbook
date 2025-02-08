import z from "zod";

const bufferSchema = z.instanceof(Buffer);

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string(),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const CarsSchema = z.object({
    brand: z.string(),
    model:z.string(),
    plateNumber: z.string(),
    color:z.string(),
    price:z.number(),
    mileage:z.number(),
    imageUrl:z.string()
})

