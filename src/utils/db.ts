import mongoose from "mongoose";
import { Danger, Log } from "./log";

export const startDb = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    Log("connected to db");
  } catch (e) {
    Danger(e);
  }
};
