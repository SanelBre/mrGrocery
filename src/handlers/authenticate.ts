import express, { Request, Response } from "express";
import { BadRequestError } from "../utils/errors";
import * as services from "./services";

const handler = express.Router();

handler.post("/authenticate", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) throw new BadRequestError("username is required");

  const user = await services.authenticate(username);

  return res.status(200).send({
    id: user._id,
    token: user.token,
  });
});

export { handler as authHandler };
