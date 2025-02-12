import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const { PORT, NODE_ENV, MONGODB_URI } = process.env;

export { PORT, NODE_ENV, MONGODB_URI };
