import { z } from "zod";

export const createBookingSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string("Email is required")
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .trim()
    .toLowerCase(),
  eventId: z
    .string("Event ID is required")
    .cuid("Invalid event ID format")
    .trim(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
