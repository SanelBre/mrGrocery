import { config } from "dotenv";

config();

const { JWT_KEY } = process.env;

export { JWT_KEY };
