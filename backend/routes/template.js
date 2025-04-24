import express from 'express'
import { getUserTemplates, templateCreater } from '../controllers/templateController.js'

const router = express.Router()

router.get("/user_templates",getUserTemplates)
router.post("/create_template",templateCreater)
    
export default router
