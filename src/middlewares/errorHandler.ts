import { HttpStatus } from "@/config/httpStatus";
import { AppError } from "@/utils/appError";
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`Error occured at PATH: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message:
      error.message ??
      "We are sorry for the inconvenience. Something went wrong on the server. Please try again later.",
  });
};
