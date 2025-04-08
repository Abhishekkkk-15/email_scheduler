import express from 'express'
import {scheduleEmail, deleteFlow, getHitory} from "../controllers/emailScheduler.js"

const router = express.Router()

router.post("/", scheduleEmail);
router.get("/history", getHitory);
router.delete("/delete", deleteFlow);
    
export default router
