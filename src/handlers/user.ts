import express, { Request, Response } from "express";
import validate from "uuid-validate";
import { availableRoles, User } from "../models/users";
import { requireAuth } from "../middlewares/AuthRequester";
import { BadRequestError, NotAuthorizedError } from "../utils/errors";
import * as services from "./services";

const handler = express.Router();

const getNodeUsersById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw new BadRequestError("user id is missing");

  const employees = await services.getNodeUsersByUserId(id);

  return res.status(200).send(employees);
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await services.getUserById(id);

  return res.status(200).send(user);
};

const updateUserById = async (req: Request, res: Response) => {
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
};

const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const dbUser = await User.findById(id);

  if (!dbUser) throw new BadRequestError(`user id [${id}] is not valid`);

  if (req.user.role !== "manager" && req.user.id !== id)
    throw new NotAuthorizedError("u cant do that");

  await services.deleteUserById(id);

  return res.status(204).send();
};

const createUser = async (req: Request, res: Response) => {
  const { username, role, nodeId, email } = req.body;

  if (!validate(nodeId)) throw new BadRequestError("invalid id provided");

  if (!username)
    throw new BadRequestError("valid username property is required");

  if (!availableRoles.includes(role))
    throw new BadRequestError("valid role property is required");

  const user = await services.createUser({
    username,
    role,
    nodeId,
    email,
  });

  return res.status(201).send(user);
};

handler.get("/user/:id/node", requireAuth(), getNodeUsersById);
handler.get("/user/:id", getUserById);
handler.patch("/user/:id", requireAuth(), updateUserById);
handler.delete("/user/:id", requireAuth(), deleteUserById);
handler.post("/user", requireAuth("manager"), createUser);

export { handler as userHandler };
