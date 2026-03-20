import "dotenv/config";
import express from "express";
import { Env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/appError";
import { HttpStatus } from "./config/httpStatus";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy server!" });
});

app.use((req, res, next) => {
  next(new AppError(`API route ${req.path} not found`, HttpStatus.NOT_FOUND));
});

app.use(errorHandler);

app.listen(Env.PORT, () =>
  console.log(`Server running at http://localhost:${Env.PORT}`),
);
