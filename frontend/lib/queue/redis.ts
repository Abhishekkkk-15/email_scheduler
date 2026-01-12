import IORedis from "ioredis";
import { ConnectionOptions } from "bullmq";

export const bullMqConnection: ConnectionOptions = {
  url: process.env.REDIS_URL,
};
