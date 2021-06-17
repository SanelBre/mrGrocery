import { UserDoc } from "../../models/users";
import { getUserByUsername, getUserById } from "./user";

export const authenticate = async (username: string): Promise<UserDoc> => {
  const dbUser = await getUserByUsername(username);

  dbUser.token = dbUser.generateToken();

  return dbUser.save();
};

export const unauthenticate = async (userId: string): Promise<void> => {
  const user = await getUserById(userId);

  user.token = null;

  await user.save();
};
