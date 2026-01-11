import { Queue, Worker } from "bullmq";
import { io } from "../websocket/socketIO.js";
console.log("CSV worker is listning");

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

new Worker(
  "csvQueue",
  async (job) => {
    const {
      userId,
      emailId,
      sender,
      emails,
      subject,
      body,
      delay,
      senderName,
    } = job.data;
    console.log("id", userId);
    io.to(userId).emit("email-status", {
      status: "PROCESSING",
      task_id: emailId,
    });
    if (emails.length == 0) return;
    const emailPayload = emails.map((e) => {
      return {
        userId,
        sender,
        to: e,
        subject,
        body,
        senderName,
        emailId,
      };
    });
    console.log("completed maping", delay);
    io.to(userId).emit("email-status", {
      status: "QUEUED",
      task_id: emailId,
    });
    await emailQueue.addBulk(
      emailPayload.map((payload) => ({
        name: "send-email",
        data: payload,
        opts: {
          delay: delay,
        },
      }))
    );
    io.to(userId).emit("email-status", { status: "QUEUED", task_id: emailId });

    console.log("Completed sending all email");
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    concurrency: 5,
  }
);
