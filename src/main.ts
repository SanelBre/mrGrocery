import "express-async-errors";
import express from "express";
import { json, urlencoded } from "body-parser";

import { startDb, Log } from "./utils";
import { seed } from "./seeds";

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.all("*", async () => {
  throw new Error("Route not found");
});

startDb().then(async () => {
  await seed();
  app.listen(PORT, () => Log(`🚀 Server listening at port: ${PORT}`));
});
