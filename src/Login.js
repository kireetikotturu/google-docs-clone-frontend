import React from "react";
import { signInWithGoogle } from "./firebase";

const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;
