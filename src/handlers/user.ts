import express, { Request, Response } from "express";
import { User } from "../models/users";
import { requireAuth } from "../middlewares/AuthRequester";
import { BadRequestError, NotAuthorizedError } from "../utils/errors";
import * as services from "./services";

const handler = express.Router();

handler.get(
  "/user/:id/node",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) throw new BadRequestError("user id is missing");

    const employees = await services.getNodeUsersByUserId(id);

    return res.status(200).send(employees);
  }
);

handler.get("/user/:id", requireAuth(), async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await services.getUserById(id);

  return res.status(200).send(user);
});

handler.patch(
  "/user/:id",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, role, email } = req.body;

    if (role !== "manager" && role !== "employee")
      throw new BadRequestError("role is not valid");

    const dbUser = await User.findById(id);

    if (!dbUser) throw new BadRequestError(`user id [${id}] is not valid`);

    if (dbUser.role !== "manager" && req.user.id !== id)
      throw new NotAuthorizedError("u cant do that");

    const employees = await services.updateUser({
      id,
      username,
      role: role as "manager" | "employee",
      email,
    });

    return res.status(201).send(employees);
  }
);

handler.delete(
  "/user/:id",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const dbUser = await User.findById(id);

    if (!dbUser) throw new BadRequestError(`user id [${id}] is not valid`);

    if (dbUser.role !== "manager" && req.user.id !== id)
      throw new NotAuthorizedError("u cant do that");

    await services.deleteUserById(id);

    return res.status(204).send();
  }
);

export { handler as userHandler };
