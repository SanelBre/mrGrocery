import "express-async-errors";
import express from "express";
import { json } from "body-parser";

import { startDb } from "./utils/db";
import { seed } from "./seeds";
import { Log } from "./utils/log";

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(json());

app.all("*", async () => {
  throw new Error("Route not found");
});

startDb().then(async () => {
  await seed();
  app.listen(PORT, () => Log(`The app is listening on port: ${PORT}`));
});
