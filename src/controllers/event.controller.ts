import { HttpStatus } from "@/config/httpStatus";
import { prisma } from "@/config/prisma";
import { CreateEventInput } from "@/validators/event.validator";
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
    events,
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
    event,
  });
};
