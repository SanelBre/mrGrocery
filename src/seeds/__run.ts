import { connection } from "mongoose";
import { startDb } from "../utils";
import { seed } from ".";

const run = () => {
  startDb().then(async () => {
    await seed();
    await connection.close();
  });
};

run();
