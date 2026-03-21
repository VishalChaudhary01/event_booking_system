import {
  createBooking,
  getUserBookings,
} from "@/controllers/booking.controller";
import { validateInput } from "@/middlewares/validateInput";
import { createBookingSchema } from "@/validators/booking.validator";
import { Router } from "express";

const bookingRoutes = Router();

bookingRoutes.post(
  "/bookings",
  validateInput(createBookingSchema),
  createBooking,
);

bookingRoutes.get("/user/:id/bookings", getUserBookings);

export default bookingRoutes;
