import { Danger, Warn, Log } from "../utils";
import { User } from "../models/users";
import { Node } from "../models/nodes";
import { insertNodes } from "./node.seed";
import { insertUsers } from "./user.seed";

export const seed = async (): Promise<void> => {
  await User.remove({}, (e) => {
    if (e) Danger(e);
    Warn("successfully dropped User collection...");
  });
  await Node.remove({}, (e) => {
    if (e) Danger(e);
    Warn("successfully dropped Node collection...");
  });
  await insertUsers();
  await insertNodes();
  Log("successfully seeded data");
};
