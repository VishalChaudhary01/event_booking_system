import {
  createAttendance,
  createEvent,
  getAllEvents,
} from "@/controllers/event.controller";
import { validateInput } from "@/middlewares/validateInput";
import {
  createAttendanceSchema,
  createEventSchema,
} from "@/validators/event.validator";
import { Router } from "express";

const eventRoutes = Router();

eventRoutes.get("/", getAllEvents);
eventRoutes.post("/", validateInput(createEventSchema), createEvent);
eventRoutes.post(
  "/:id/attendence",
  validateInput(createAttendanceSchema),
  createAttendance,
);

export default eventRoutes;
