import { HttpStatus } from "@/config/httpStatus";
import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/appError";
import {
  CreateAttendanceInput,
  CreateEventInput,
} from "@/validators/event.validator";
import { RequestHandler } from "express";

export const getAllEvents: RequestHandler = async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      totalCapacity: true,
      remainingTickets: true,
      createdAt: true,
    },
  });

  res.status(HttpStatus.OK).json({
    message: "Events fetched successfully",
    data: events,
  });
};

export const createEvent: RequestHandler = async (req, res) => {
  const input: CreateEventInput = req.body;

  const event = await prisma.event.create({
    data: {
      ...input,
      date: new Date(input.date),
      remainingTickets: input.totalCapacity,
    },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      totalCapacity: true,
      remainingTickets: true,
      createdAt: true,
    },
  });

  res.status(HttpStatus.CREATED).json({
    message: "Event create successfully",
    data: event,
  });
};

export const createAttendance: RequestHandler = async (req, res) => {
  const eventId = req.params.id as string;
  const { bookingCode }: CreateAttendanceInput = req.body;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) {
    throw new AppError("Event not found", HttpStatus.NOT_FOUND);
  }

  const booking = await prisma.booking.findFirst({
    where: {
      bookingCode,
      eventId,
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
      attendance: true,
    },
  });

  if (!booking) {
    throw new AppError(
      "Invalid booking code for this event",
      HttpStatus.NOT_FOUND,
    );
  }

  if (booking.attendance) {
    throw new AppError(
      "This booking has already been checked in",
      HttpStatus.CONFLICT,
    );
  }

  const attendance = await prisma.attendance.create({
    data: {
      bookingId: booking.id,
      eventId,
    },
  });

  const totalBookingsForEvent = await prisma.booking.count({
    where: { eventId },
  });

  res.status(HttpStatus.OK).json({
    message: "Attendance recorded successfully",
    data: {
      attendanceId: attendance.id,
      entryTime: attendance.entryTime,
      bookingCode: booking.bookingCode,
      bookedOn: booking.bookingDate,
      user: booking.user,
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        totalCapacity: event.totalCapacity,
      },
      ticketsBookedForEvent: totalBookingsForEvent,
    },
  });
};
