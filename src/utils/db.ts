import mongoose from "mongoose";
import { Danger, Log } from "./log";

let retryConnectCount = 0;

export const startDb = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL ?? "mongodb://localhost:27017/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    Log("connected to db");
  } catch (e) {
    Danger(e);
    Danger("Failed to connect to mongo on startup - retrying in 1 sec");
    if (retryConnectCount < 5) setTimeout(startDb, 1000);
    retryConnectCount = +1;
  }
};
