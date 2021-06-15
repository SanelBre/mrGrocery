import { Request, Response, NextFunction } from "express";
import { User } from "../models/users";
import { NotAuthorizedError } from "../utils/errors";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<Response<unknown, Record<string, unknown>> | void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    throw new NotAuthorizedError(
      "you first need to authenticate for this request"
    );

  const user = await User.findByToken(token);

  if (!user) throw new NotAuthorizedError("invalid token provided");

  req.user = user;

  return next();
};
