import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Backend/firebase";

function Signup({ onSignupComplete }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccess("User created: " + userCredential.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  const toRotate = ["Signup"];
  
    const [text, setText] = useState("");
    const [loopNum, setLoopNum] = useState(0);
    const [delta, setDelta] = useState(400);
  
    useEffect(() => {
      if (text === toRotate[loopNum % toRotate.length]) return;
  
      const ticker = setInterval(() => {
        tick();
      }, delta);
  
      return () => clearInterval(ticker);
    }, [text]);
  
    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
  
      let updatedText = fullText.substring(0, text.length + 1);
      setText(updatedText);
  
      if (updatedText === fullText) {
        clearInterval(); 
      }
    };

  return (
    <div className="animated-gradient py-30 h-[100vh]">
      {/* <img src={personImg} alt="Person" /> */}
      <div className="max-w-sm mx-auto p-6 border rounded backdrop-blur-2xl bg-white/15 shadow-lg shadow-black/50">
        <h2 className="text-xl font-bold mb-4 text-center">
          <span>{text}</span>
          <span className="">|</span>
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        {error && <p className="text-red-500 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}

        <div className="mt-4 text-center">
          Already a user?{" "}
          <i
            onClick={onSignupComplete}
            className="cursor-pointer hover:underline"
          >
            Login
          </i>
        </div>
      </div>
    </div>
  );
}

export default Signup;
