import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import flowRoute from "./routes/emailRoutes.js";
import userRoute from "./routes/userRoutes.js";
import auth from "./utils/auth.js";
import cookieParser from "cookie-parser";
import jwt, { decode } from 'jsonwebtoken';
import path from 'path'
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}))
app.use(express.json());
app.use(cookieParser());
app.use((req,res,next)=>{
  const token = req.cookies.token
  if(!token){
    next()
    return
  }
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
      req.user = decoded; 
  console.log("its comming here")
  next()
})
mongoose
  .connect(
    "mongodb+srv://mrabhi748:abhishek1122@cluster0.1s9sife.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"));
  app.use(express.static(path.join(__dirname, "dist")));
app.use("/api/auth", userRoute);
app.use("/api/flow", auth, flowRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
