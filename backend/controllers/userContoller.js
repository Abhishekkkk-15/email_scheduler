import { User } from "../models/schema.js";
import { sign } from "../utils/jwt.js";
import bcrypt from "bcrypt"


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(404).json({ message: "User credintials' not provided" });
  }
  try {
    //Checking if user exist with same email
    const isUserExist = await User.findOne({
      email: email,
    });
    if (isUserExist) {
      return res.status(404).json({ message: "User with email already exist" });
    }
    //encrupting password by bcrypt
    const encyruptedPassword = await bcrypt.hash(password,10)
    //saving new user in db
  const user =  await User.create({
      name,
      email,
      password:encyruptedPassword,
    })
    res.status(200).json({ message: "User Registred"});
  } catch (error) {
    console.log("Error while Registreing User", error);
    res.status(505).json({ message: "Server Error 505" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "User credintials' not provided" });
  }
  try {
    //getting user info for authincation from db
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credintials" });
    }
    //compaing encrupted password with given password by user
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //generating JWT token by userId payload
      const token = sign(user._id);
      // user data
      let userInfo = {
        _id:user._id,
        name:user.name,
        email:user.email
      }
      //sending response and also setting cookies for authication
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: "true",
          maxAge: 30*24*60*60*1000,
          sameSite: "None",
        })
        .json({ message: "Success",userInfo });
    } else {
      res.status(404).json({ message: "Invalid Credintials" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(505).json({ message: "Server Error 505" });
  }
};

export const userInfo = async(req,res)=>{
    try {
      // Getting userId from decoded JWT token
        const payload = req?.user?.payload;
        if (!payload) return res.status(200).json({message:"Not authincated"})
      // Getting user data by userId , and preventing password to be send to frontend
       const userInfo = await User.findById({
            _id:payload
        }).select('-password ')
        if(!userInfo){
          return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({
            userInfo
        })
    } catch (error) {
      console.log(error)
        res.status(505).json({ message: "Server Error 505" });
    }
}

export const logout = async (req, res) => {
  try {
    //clearing user token from frontend
     return res.clearCookie('token',{
        httpOnly:true,
        secure:"true",
        sameSite:'None'
      }).status(200).json({ message: "logout successfully" });
  }
  catch (error) {
      res.status(500).json({ message: "Error whilte updating user Profile" });
  }
};