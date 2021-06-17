import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { awailableNodeTypes } from "../models/nodes";
import { requireAuth } from "../middlewares/AuthRequester";
import { BadRequestError, NotAuthorizedError } from "../utils/errors";
import * as services from "./services";

const handler = express.Router();

handler.get(
  "/node/:id/employees",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descendants } = req.query;

    if (!id) throw new BadRequestError("node id is missing");

    const withDescendants = /^true$/i.test(descendants?.toString());

    const employees = withDescendants
      ? await services.getEmployeesWithDescendantsByNodeId(id)
      : await services.getEmployeesByNodeId(id);

    return res.status(200).send(employees);
  }
);

handler.get(
  "/node/:id/managers",
  requireAuth(),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descendants } = req.query;

    if (!id) throw new BadRequestError("node id is missing");

    const withDescendants = /^true$/i.test(descendants?.toString());

    const employees = withDescendants
      ? await services.getManagersWithDescendantsByNodeId(id)
      : await services.getManagersByNodeId(id);

    return res.status(200).send(employees);
  }
);

handler.get("/node", async (req: Request, res: Response) => {
  const nodes = await services.getAllNodes();

  return res.status(200).send(nodes);
});

handler.get("/node/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id))
    throw new BadRequestError("invalid id provided");

  const node = await services.getNodeById(id);

  return res.status(200).send(node);
});

handler.patch("/node/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, nodeType } = req.body;

  if (req.user.role !== "manager" && req.user.id !== id)
    throw new NotAuthorizedError(
      `u perform an update on the user with id: [${id}]`
    );

  if (!name && !nodeType)
    throw new BadRequestError(
      "neither name or nodeType were provided in order to make an update to the node"
    );

  if (nodeType && !awailableNodeTypes.includes(nodeType))
    throw new BadRequestError(`invalid nodeType provided: [${nodeType}]`);

  await services.updateNode({
    id,
    name,
    nodeType,
  });

  return res.status(201).send();
});

export { handler as nodeHandler };
