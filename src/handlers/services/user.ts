import { BadRequestError } from "../../utils/errors";
import { User, UserDoc } from "../../models/users";
import { Node } from "../../models/nodes";

export const getNodeUsersByUserId = async (
  userId: string
): Promise<UserDoc[]> => {
  const dbUser = await User.findById(userId);

  if (!dbUser) throw new BadRequestError(`user id [${userId}] is not valid`);

  const isManager = dbUser.role === "manager";

  const node = await Node.findByUserId(userId);

  const nodeUserIds = [...node.employees, ...(isManager && node.managers)];

  return Promise.all(
    nodeUserIds.map(async (id) => {
      return User.findById(id);
    })
  );
};

export const getUserById = async (id: string): Promise<UserDoc> => {
  const dbUser = await User.findById(id);

  return dbUser;
};

export const updateUser = async (payload: {
  id: string;
  username: string;
  email: string;
  role: "manager" | "employee";
}): Promise<UserDoc> => {
  const { id, username, email, role } = payload;

  const dbUser = await User.findById(id);

  if (username) dbUser.username = username;

  if (email) dbUser.email = email;

  if (role) dbUser.role = role;

  return dbUser.save();
};

export const deleteUserById = async (id: string): Promise<void> => {
  const dbUser = await User.findById(id);

  dbUser.deleated = true;
};
