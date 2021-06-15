import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export interface UserType {
  _id: string;
  username: string;
  role: "manager" | "employee";
  token?: string;
}

export type UserDoc = UserType &
  mongoose.Document & {
    generateToken: () => string;
  };

type UserModel = mongoose.Model<UserDoc> & {
  findById: (id: string) => Promise<UserDoc>;
  findByUsername: (username: string) => Promise<UserDoc>;
  findByToken: (username: string) => Promise<UserDoc>;
};

const userSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    _id: { type: String, default: () => uuidv4() },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "employee"],
      required: true,
    },
    token: {
      type: String,
      expires: 10000,
    },
  },
  {
    _id: false,
    versionKey: false,
    collection: "grocery_users",
  }
);

userSchema.statics.findById = async function (id: string): Promise<UserDoc> {
  const user = await this.findOne({ _id: id }).exec();
  return user;
};

userSchema.statics.findByUsername = async function (
  username: string
): Promise<UserDoc> {
  const user = await this.findOne({ username }).exec();
  return user;
};

userSchema.statics.findByToken = async function (
  token: string
): Promise<UserDoc> {
  const user = await this.findOne({ token }).exec();
  return user;
};

userSchema.methods.generateToken = function (): string {
  return jwt.sign(
    {
      id: this.id,
      email: this.username,
    },
    process.env.JWT_KEY
  );
};

export const User = mongoose.model("User", userSchema);
