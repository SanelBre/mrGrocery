import { UserDoc } from "../models/users";

export * from "./AuthRequester";
export * from "./ErrorCatcher";

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}
