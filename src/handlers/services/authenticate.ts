import { NotFoundError } from "../../utils/errors";
import { User, UserDoc } from "../../models/users";

export const authenticate = async (username: string): Promise<UserDoc> => {
  const user = await User.findByUsername(username);

  if (!user) throw new NotFoundError("User not found");

  user.token = user.generateToken();

  await user.save();

  return user;
};
