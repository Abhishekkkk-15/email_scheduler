import Agenda from "agenda";
import {sendEmail} from "../utils/mailer.js";
import { Flow } from "../models/schema.js";
import { config } from "dotenv";
config()

export const agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: "jobs" },
})

agenda.define("send email",async (job) => {
    const {to,subject, body, id} = job.attrs.data;
    try {
        await sendEmail({to,subject,body})
        
       await Flow.findByIdAndUpdate({
            _id:id
        },{
            completed:true
        })
    } catch (error) {
        console.log(error)
    }
})

agenda

async function init(){
    await agenda.start();
}
init()
