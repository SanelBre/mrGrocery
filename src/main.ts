import "express-async-errors";
import express from "express";
import { json, urlencoded } from "body-parser";

import { startDb, Log } from "./utils";
import { seed } from "./seeds";
import { ErrorCatcher } from "./middlewares";
import { NotFoundError } from "./utils/errors";
import { authHandler, userHandler, nodeHandler } from "./handlers";

const runSeeds = process.argv.slice(2)[0] === "--seed";

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(authHandler);
app.use(userHandler);
app.use(nodeHandler);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(ErrorCatcher);

startDb().then(async () => {
  if (runSeeds) await seed();
  app.listen(PORT, () => Log(`🚀 Server listening at port: ${PORT}`));
});
