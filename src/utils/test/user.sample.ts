import { UserDoc, UserType } from "../../models/users";

interface UserSampleRequest {
  deleated?: UserType["deleated"];
  role?: UserType["role"];
  username?: UserType["username"];
  email?: UserType["email"];
  token?: UserType["token"];
}

const userSample = (payload?: UserSampleRequest): UserType => ({
  _id: "someUserId",
  username: payload?.username ?? "someUsername",
  role: payload?.role ?? "manager",
  email: payload?.email ?? "someUserEmail",
  deleated: !!payload?.deleated,
  token: payload?.token,
});

export const sampleUserDoc = (payload?: UserSampleRequest): UserDoc =>
  <UserDoc>{
    ...userSample(payload),
    save: () => this,
    generateToken: () => "newToken",
  };
