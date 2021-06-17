import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares";
import { BadRequestError } from "../utils/errors";
import * as services from "./services";

const handler = express.Router();

const authenticate = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) throw new BadRequestError("username is required");

  const user = await services.authenticate(username);

  return res.status(200).send({
    id: user._id,
    token: user.token,
  });
};

const unauthenticate = async (req: Request, res: Response) => {
  const userId = req.user.id;

  await services.unauthenticate(userId);

  return res.status(204).send();
};

handler.post("/authenticate", authenticate);
handler.delete("/authenticate", requireAuth(), unauthenticate);

export { handler as authHandler };
