import { config } from "dotenv";
import IORedis from "ioredis";
config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL not defined");
}
export const redis =
  global.redis ??
  new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});
