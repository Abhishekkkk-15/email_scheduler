import React, { useState } from "react";
import axios from "axios";
import { loginUser, signUpUser } from "../api/api";

function SignUp({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    try {
      if(!email || !password || !name){
        return alert("All fields are required!!")
      }
      const { data } = await signUpUser(name,email,password)
     const res= await loginUser(email,password)
      onSuccess(res.data.userInfo)
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert("Signup failed. Try a different email.");
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto mt-20 gap-5 p-6">
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="px-4 py-2  outline-none"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2  outline-none"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2  outline-none"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignUp}
        className="bg-gray-400 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
