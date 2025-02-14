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
    username: z.string().optional(),
    password: z.string().optional(),
    name: z.string().optional(),
    imageUrl: z.string().url().optional(),
    profileFolderId: z.string().optional()
})

export const CarsSchema = z.object({
    brand: z.string(),
    model:z.string(),
    plateNumber: z.string(),
    color:z.string(),
    price:z.number(),
    mileage:z.number(),
    imageUrl:z.string().url(),
    carFolderId:z.string(),
})

export const CarsUpdateSchema = z.object({
    color:z.string().optional(),
    price:z.number().optional(),
    mileage:z.number().optional(),
    imageUrl:z.string().url().optional()
})

export const BookingSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    allDay: z.boolean(),
    carId: z.number(),
    customerName: z.string(),
    customerContact: z.string(),
    dailyRentalPrice: z.number(),
    totalAmount:z.number()
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
    totalAmount: z.number()
});


const DocumentSchema = z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    folderId:z.string()
  });


export  const BookingStartSchema = z.object({
address: z.string(),
bookingAmountReceived: z.number(),
customerName: z.string(),
dailyRentalPrice: z.number(),
documents: z.array(DocumentSchema),
notes: z.string(),
odometerReading: z.string(),
paymentMethod: z.string(),
phoneNumber: z.string(),
returnDate: z.string(),
returnTime: z.string(),
securityDeposit: z.string(),
selectedCar: z.number(),
startDate: z.string(),
startTime: z.string(),
totalAmount: z.number(),
selfieUrl: z.string().url(),
carImages: z.array(DocumentSchema),
});

export const BookingEndSchema = z.object({
    endDate: z.string(),
    endTime: z.string(),
    totalAmount: z.number(),
})

export const CalendarUpdateSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    allDay: z.boolean().optional(),
    customerName: z.string().optional(),
});

declare global {
    namespace Express {
      export interface Request {
        userId?: number;
        name?: string;
      }
    }
}