import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors";

export const ErrorCatcher = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): Response<unknown, Record<string, unknown>> | void => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({ errors: error.serialize() });
  }

  if (error)
    return res.status(500).send({
      errors: [
        {
          message: error.message,
        },
      ],
    });

  return next();
};
