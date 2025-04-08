import { User } from "../models/schema.js";
import { sign } from "../utils/jwt.js";
import bcrypt from "bcrypt"


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(404).json({ message: "User credintials' not provided" });
  }
  try {
    const isUserExist = await User.findOne({
      email: email,
    });
    if (isUserExist) {
      return res.status(404).json({ message: "User with email already exist" });
    }
    const encyruptedPassword = await bcrypt.hash(password,10)
  const user =  await User.create({
      name,
      email,
      password:encyruptedPassword,
    })
    let userInfo={
      _id:user._id,
      name:user.name,
      email:user.email
    }
    res.status(200).json({ message: "User Registred" ,userInfo});
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
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credintials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = sign(user._id);
      let userInfo = {
        _id:user._id,
        name:user.name,
        email:user.email
        
      }
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: "true",
          maxAge: 3600000,
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
        const payload = req?.user?.payload;
        if (!payload) return res.status(200).json({message:"Not authincated"})
       const userInfo = await User.findById({
            _id:payload
        }).select('-password ')
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
      res.clearCookie('token',{
        httpOnly:true,
        secure:"true",
        sameSite:'None'
      });
      res.status(200).json({ message: "logout successfully" });
  }
  catch (error) {
      res.status(500).json({ message: "Error whilte updating user Profile" });
  }
};