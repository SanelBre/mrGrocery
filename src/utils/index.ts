import { UserDoc } from "../models/users";

export * from "./log";
export * from "./db";

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
