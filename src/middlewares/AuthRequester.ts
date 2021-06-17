import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../utils/errors";
import { User, UserType } from "../models/users";

export const requireAuth =
  (forRole?: UserType["role"]) =>
  async (
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

    if (forRole && forRole !== user.role)
      throw new NotAuthorizedError(
        "you do not have permission for this action"
      );

    req.user = user;

    return next();
  };
