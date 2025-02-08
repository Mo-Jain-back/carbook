const dummyCar = {
    "brand": "Toyota",
    "model": "Corolla",
    "plateNumber": "ABC-1234",
    "color": "White",
    "price": 20000,
    "mileage": 15000,
    "imageUrl": "https://example.com/car-image.jpg"
}

const dummyCarUpdate = {
    "color": "Black",
    "price": 21000,
    "mileage": 14000,
    "imageUrl": "https://example.com/new-car-image.jpg"
}

const dummyBooking = {
    "startDate": "2025-02-10",
    "endDate": "2025-02-15",
    "startTime": "09:00",
    "endTime": "18:00",
    "allDay": false,
    "carId": 1,
    "customerName": "John Doe",
    "securityDeposit": "500",
    "customerContact": "+1234567890",
    "dailyRentalPrice": 100
}

const dummyBookingUpdate = {
    "startDate": "2025-02-12",
    "endDate": "2025-02-18",
    "startTime": "10:00",
    "endTime": "19:00",
    "allDay": false,
    "carId": 2,
    "customerName": "Jane Doe",
    "customerAddress": "123 Main St, City, Country",
    "customerContact": "+0987654321",
    "securityDeposit": "600",
    "dailyRentalPrice": 120,
    "paymentMethod": "Credit Card"
}

const dummyCalendarUpdate = {
    "startDate": "2025-02-14",
    "endDate": "2025-02-16",
    "startTime": "08:00",
    "endTime": "20:00",
    "allDay": true,
    "customerName": "Alice Smith",
    "carId": 3
}

const dummyBookingStart = {
    "customerName": "John Doe",
    "phoneNumber": "+1234567890",
    "selectedCar": "Toyota Camry",
    "startDate": "2025-03-01",
    "startTime": "10:00 AM",
    "returnDate": "2025-03-10",
    "returnTime": "5:00 PM",
    "securityDeposit": "500 USD",
    "odometerReading": "30000",
    "address": "123 Main St, City, Country",
    "bookingAmountReceived": 200,
    "dailyRentalCharges": 50,
    "totalAmount": 500,
    "paymentMethod": "Credit Card",
    "notes": "Customer requested a child seat."
  };

export {
    dummyCar,
    dummyCarUpdate,
    dummyBooking,
    dummyBookingUpdate,
    dummyCalendarUpdate
}
