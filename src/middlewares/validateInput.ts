import { ZodSchema } from "zod";
import { RequestHandler } from "express";

export const validateInput =
  (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
