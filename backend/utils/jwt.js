import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()
const secret = process.env.JWT_SECRET;

export const sign = (payload) =>{ 
  return  jwt.sign({payload}, secret, { expiresIn: '7d' }    
    )};

export const verify = (token) =>{return jwt.verify(token, secret);} 
