import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Backend/firebase";
import Signup from "./signup";
import { useNavigate } from "react-router-dom";
import personImg from "./person.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const toRotate = ["Login"];

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

  if (showSignup)
    return <Signup onSignupComplete={() => setShowSignup(false)} />;

  return (
    <div className="animated-gradient py-30 h-[100vh] relative">
      <div className="max-w-sm mx-auto p-6 border rounded backdrop-blur-2xl bg-white/15 shadow-lg shadow-black/50">
        <h2 className="text-xl font-bold mb-4 text-center">
          <span>{text}</span>
          <span className="">|</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <div className="mt-4 text-center">
          New User?{" "}
          <i
            onClick={() => setShowSignup(true)}
            className=" cursor-pointer hover:underline"
          >
            Sign Up
          </i>
        </div>
      </div>
    </div>
  );
}

export default Login;
