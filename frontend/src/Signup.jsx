import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/signup", {
        name,
        email,
        password,
      });

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      alert("Account created successfully. Please login.");

      // Redirect to Login page
      navigate("/");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Recruiter Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-4 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-6 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-blue-600 text-white w-full py-2 rounded-lg"
        >
          Sign Up
        </button>

        {/* Go to Login Link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Signup;