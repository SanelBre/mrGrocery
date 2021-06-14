import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface UserType {
    _id?: string;
    username: string;
    role: "manager" | "employee"
}

type UserDoc = UserType & mongoose.Document

interface UserModel extends mongoose.Model<UserDoc> {}

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
        required: true
    }
  },
  {
    _id: false,
    versionKey: false,
    collection: 'grocery_users'
  }
);

export const User = mongoose.model("User", userSchema);
