import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

function AuthPage({ setLogedUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = (user) => {
    if (user) {
      return setLogedUser(user);
    }
    return;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {isLogin ? (
        <Login onSuccess={handleSuccess} />
      ) : (
        <SignUp onSuccess={handleSuccess} />
      )}

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-sm cursor-pointer underline"
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default AuthPage;
