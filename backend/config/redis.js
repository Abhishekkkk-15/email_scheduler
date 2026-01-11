import { config } from "dotenv";
import IORedis from "ioredis";
config();
console.log("red");
export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});
