import z from "zod";

const bufferSchema = z.instanceof(Buffer);

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string().optional(),
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

export const CarsUpdateSchema = z.object({
    color:z.string().optional(),
    price:z.number().optional(),
    mileage:z.number().optional(),
    imageUrl:z.string().optional()
})

export const BookingSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    allDay: z.boolean(),
    carId: z.number(),
    customerName: z.string(),
    securityDeposit: z.string(),
    customerContact: z.string(),
    dailyRentalPrice: z.number(),
})

export const BookingUpdateSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    allDay: z.boolean().optional(),
    carId: z.number().optional(),
    customerName: z.string().optional(),
    customerAddress: z.string().optional(),
    customerContact: z.string().optional(),
    securityDeposit: z.string().optional(),
    dailyRentalPrice: z.number().optional(),
    paymentMethod: z.string().optional(),
});

export const BookingStartSchema = z.object({
    customerName: z.string(),
    phoneNumber: z.string(),
    selectedCar: z.number(),
    startDate: z.string(),
    startTime: z.string(),
    returnDate: z.string(),
    returnTime: z.string(),
    securityDeposit: z.string(),
    odometerReading: z.string(),
    address: z.string(),
    bookingAmountReceived: z.number(),
    dailyRentalCharges: z.number(),
    totalAmount: z.number(),
    paymentMethod: z.string(),
    notes: z.string()
})

export const CalendarUpdateSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    allDay: z.boolean().optional(),
    customerName: z.string().optional(),
    carId: z.number().optional(),
});

declare global {
    namespace Express {
      export interface Request {
        userId?: number;
        name?: string;
      }
    }
}