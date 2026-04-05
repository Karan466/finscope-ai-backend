import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({
          statusCode: 400,
          message: "Validation failed",
          errors: error.errors,
        });
      }

      next(error);
    }
  };
};

export default validateRequest;