import { createEvent, getAllEvents } from "@/controllers/event.controller";
import { validateInput } from "@/middlewares/validateInput";
import { createEventSchema } from "@/validators/event.validator";
import { Router } from "express";

const eventRoutes = Router();

eventRoutes.get("/", getAllEvents);
eventRoutes.post("/", validateInput(createEventSchema), createEvent);

export default eventRoutes;
