import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters")
    .trim(),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional(),

  date: z
    .string("Date is required")
    .datetime({ message: "Date must be a valid ISO 8601 datetime" })
    .refine((val) => new Date(val) > new Date(), {
      message: "Event date must be in the future",
    }),

  totalCapacity: z
    .number("Total capacity is required")
    .int("Total capacity must be a whole number")
    .min(1, "Total capacity must be at least 1")
    .max(100000, "Total capacity must be at most 100,000"),
});

export const createAttendanceSchema = z.object({
  bookingCode: z
    .string("Booking code is required")
    .uuid("Invalid booking code format")
    .trim(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
