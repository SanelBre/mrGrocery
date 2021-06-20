import { UserDoc, UserType } from "../../models/users";

interface UserSampleRequest {
  deleated?: UserType["deleated"];
  role?: UserType["role"];
  username?: UserType["username"];
  email?: UserType["email"];
}

const userSample = (payload?: UserSampleRequest): UserType => ({
  _id: "someUserId",
  username: payload?.username ?? "someUsername",
  role: payload?.role ?? "manager",
  email: payload?.email ?? "someUserEmail",
  deleated: !!payload?.deleated,
  token: "someUserAuthToken",
});

export const sampleUserDoc = (payload?: UserSampleRequest): UserDoc =>
  <UserDoc>{
    ...userSample(payload),
    save: () => this,
  };
