import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import flowRoute from "./routes/emailRoutes.js";
import userRoute from "./routes/userRoutes.js";
import auth from "./utils/auth.js";
import cookieParser from "cookie-parser";
import jwt, { decode } from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//medaleWare to add JWT payload to user Request
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    next();
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});
// MongoDB database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));
app.use("/api/auth", userRoute);
//Auth medaleWare is to prevent unAunticated user to access
app.use("/api/flow", auth, flowRoute);
//Serving static files (Frontend)
app.use(express.static(path.join(__dirname, "dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
