import { Router } from "express";
import eventRoutes from "./event.routes";
import bookingRoutes from "./booking.route";

const appRoutes = Router();

appRoutes.use("/events", eventRoutes);
appRoutes.use("/", bookingRoutes);

export default appRoutes;
