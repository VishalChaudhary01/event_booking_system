import { Router } from "express";
import eventRoutes from "./event.routes";

const appRoutes = Router();

appRoutes.use("/events", eventRoutes);

export default appRoutes;
