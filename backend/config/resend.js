import { config } from "dotenv";
import { Resend } from "resend";
config();
console.log("api", process.env.RESEND_API_KEY);
console.log("REDIS url", process.env.REDIS_URL);

export const resend = new Resend(process.env.RESEND_API_KEY);
