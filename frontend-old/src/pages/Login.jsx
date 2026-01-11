import React, { useState } from "react";
import axios from "axios";
import { loginUser } from "../api/api";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    

    try {
      const { data } = await loginUser(email,password)
      onSuccess(data?.userInfo);
    } catch (error) {
      console.error(error?.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto mt-20 gap-5 p-6 ">
      <h2 className="text-2xl font-semibold text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 outline-none"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-2  outline-none"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-gray-500 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
