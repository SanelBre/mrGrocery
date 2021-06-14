import { startDb } from "./utils/db";
import { seed } from "./seeds";

startDb().then(async () => {
  await seed();
});
