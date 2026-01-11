import { Worker } from "bullmq";
import { io } from "../websocket/socketIO.js";
import { resend } from "../config/resend.js";
import { Flow } from "../models/schema.js";
console.log("worker is listning");
new Worker(
  "emailQueue",
  async (job) => {
    const { userId, emailId, senderName, sender, to, subject, body } = job.data;
    console.log(subject);
    io.to(userId).emit("email-status", { status: "SENDING", flowId: emailId });
    try {
      const result = await resend.emails.send({
        from: `${senderName} ${process.env.SENDER_EMAIL}`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: body || "<p>Test</p>",
      });

      if (!result || result.error) {
        throw new Error(JSON.stringify(result));
      }
      console.log("Email sent");
      const task = await Flow.findByIdAndUpdate(
        emailId,
        { $inc: { taskCompleted: 1 } },
        { new: true }
      );
      console.log("task", emailId);
      io.to(userId).emit("taskCount", {
        taskCompleted: task.taskCompleted,
        flowId: emailId,
      });
    } catch (error) {
      console.log("Error while send email", error);
    }
    io.to(userId).emit("email-status", { status: "SENT", flowId: emailId });
    console.log("sent email to " + senderName);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    concurrency: 5,
  }
);
