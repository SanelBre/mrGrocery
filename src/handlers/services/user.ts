import { BadRequestError, NotFoundError } from "../../utils/errors";
import { User, UserDoc, UserType } from "../../models/users";
import { getNodeById, getNodeByUserId } from "./node";

export const getUserById = async (id: string): Promise<UserDoc> => {
  const dbUser = await User.findById(id);

  if (!dbUser || dbUser.deleated) throw new NotFoundError("user was not found");

  return dbUser;
};

export const getUserByUsername = async (username: string): Promise<UserDoc> => {
  const dbUser = await User.findByUsername(username);

  if (!dbUser || dbUser.deleated) throw new NotFoundError(`user was not found`);

  return dbUser;
};

export const getNodeUsersByUserId = async (
  userId: string
): Promise<UserDoc[]> => {
  const dbUser = await getUserById(userId);

  const isManager = dbUser.role === "manager";

  const node = await getNodeByUserId(userId);

  const nodeUserIds = [...node.employees, ...(isManager ? node.managers : [])];

  const users = await Promise.all(
    nodeUserIds.map(async (id) => {
      return User.findById(id);
    })
  );

  return users?.filter((user) => !user.deleated);
};

export const updateUser = async (payload: {
  id: string;
  username?: string;
  email?: string;
  role?: "manager" | "employee";
}): Promise<UserDoc> => {
  const { id, username, email, role } = payload;

  const dbUser = await getUserById(id);

  if (username) dbUser.username = username;

  if (email) dbUser.email = email;

  if (role) dbUser.role = role;

  await dbUser.save();

  return dbUser;
};

export const deleteUserById = async (id: string): Promise<void> => {
  const dbUser = await getUserById(id);

  dbUser.deleated = true;

  await dbUser.save();
};

export const createUser = async (payload: {
  username: string;
  role: UserType["role"];
  nodeId: string;
  email?: string;
}): Promise<UserDoc> => {
  const { username, role, nodeId, email } = payload;

  const dbUser = await getUserByUsername(username).catch(() => null);

  if (dbUser)
    throw new BadRequestError(`username [${username}] is already taken`);

  const node = await getNodeById(nodeId);

  const user = await User.create({
    username,
    role,
    email,
  });

  if (role === "manager") node.managers.push(user._id);
  else if (role === "employee") node.employees.push(user._id);
  else throw new Error("UNEXPECTED_ERROR");

  await user.save();

  await node.save();

  return user;
};
