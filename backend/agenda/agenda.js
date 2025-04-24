import Agenda from "agenda";
import { sendEmail } from "../utils/mailer.js";
import { Flow } from "../models/schema.js";
import { config } from "dotenv";
import { getReciverSocketId, io } from "../websocket/socketIO.js";
config();

export const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "jobs" },
});

agenda.define("send email", async (job) => {
  const { to, subject, body, id, receiverId } = job.attrs.data;
  try {
    await sendEmail({ to, subject, body });

    const task = await Flow.findByIdAndUpdate(
      id,
      { $inc: { taskCompleted: 1 } },
      { new: true }
    );

    const userId = getReciverSocketId(receiverId);
    if (userId) {
        console.log("its comming here")
      io.to(userId).emit("taskCount", {
        taskCompleted: task.taskCompleted,
        flowId: id
      });
    }
  } catch (error) {
    console.log(error);
  }
});

agenda;

async function init() {
  await agenda.start();
}
init();
