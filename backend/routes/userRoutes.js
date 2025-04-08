import express from 'express'
import { login, logout, registerUser, userInfo } from '../controllers/userContoller.js'

const router = express.Router()

router.post("/signUp",registerUser)
router.post("/login",login)
router.get("/userInfo",userInfo)
router.get("/logout",logout)
    
export default router
