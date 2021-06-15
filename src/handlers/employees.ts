import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/AuthRequester";
import { BadRequestError } from "../utils/errors";
import * as services from "./services";

const router = express.Router();

router.get(
  "/node/:id/employees",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descendants } = req.query;

    if (!id) throw new BadRequestError("node id is missing");

    const withDescendants = /^true$/i.test(descendants.toString());

    const employees = withDescendants
      ? services.getEmployeesWithDescendantsByNodeId(id)
      : services.getEmployeesByNodeId(id);

    return res.status(200).send(employees);
  }
);
