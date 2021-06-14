import { v4 as uuidv4 } from "uuid";
import * as faker from "faker";
import { UserType, User } from "../models/users";

const availableUserRoles: UserType["role"][] = ["manager", "employee"];

const users: UserType[] = Array(111)
  .fill(null)
  .map((_, index) => {
    const user: UserType = {
      _id: uuidv4(),
      username: faker.internet.userName(),
      role: index % 3 ? availableUserRoles[1] : availableUserRoles[0],
    };

    return user;
  });

export const insertUsers = async (): Promise<void> => {
  await User.insertMany(users);
};

export { users };
