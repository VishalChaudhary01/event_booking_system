import { HttpStatus } from "@/config/httpStatus";
import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/appError";
import { CreateBookingInput } from "@/validators/booking.validator";
import { RequestHandler } from "express";
import { randomUUID } from "node:crypto";

export const createBooking: RequestHandler = async (req, res) => {
  const { name, email, eventId }: CreateBookingInput = req.body;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError("Event not found", HttpStatus.NOT_FOUND);
  }

  if (event.date < new Date()) {
    throw new AppError(
      "Cannot book a ticket for a past event",
      HttpStatus.BAD_REQUEST,
    );
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { name, email },
  });

  const booking = await prisma.$transaction(async (tx) => {
    /* lock the event row so no other transaction can
       read/update remainingTickets until this one completes */

    const lockedEvent = await tx.$queryRaw<
      { id: string; remainingTickets: number }[]
    >`
      SELECT id, remainingTickets
      FROM Event
      WHERE id = ${eventId}
      FOR UPDATE
    `;

    if (!lockedEvent.length || lockedEvent[0].remainingTickets <= 0) {
      throw new AppError("No tickets available", HttpStatus.BAD_REQUEST);
    }

    await tx.$executeRaw`
      UPDATE Event
      SET remainingTickets = remainingTickets - 1
      WHERE id = ${eventId}`;

    const newBooking = await tx.booking.create({
      data: {
        userId: user.id,
        eventId,
        bookingCode: randomUUID(),
      },
      select: {
        id: true,
        bookingCode: true,
        bookingDate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        event: {
          select: {
            id: true,
            title: true,
            date: true,
            remainingTickets: true,
          },
        },
      },
    });

    return newBooking;
  });

  res
    .status(HttpStatus.CREATED)
    .json({ message: "Booking created successfully", data: booking });
};

export const getUserBookings: RequestHandler = async (req, res) => {
  const id = req.params.id as string;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found", HttpStatus.NOT_FOUND);
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: id },
    orderBy: { bookingDate: "desc" },
    select: {
      id: true,
      bookingCode: true,
      bookingDate: true,
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          totalCapacity: true,
          remainingTickets: true,
        },
      },
      attendance: {
        select: {
          id: true,
          entryTime: true,
        },
      },
    },
  });

  res
    .status(HttpStatus.OK)
    .json({ message: "Bookings fetched successfully", data: bookings });
};
