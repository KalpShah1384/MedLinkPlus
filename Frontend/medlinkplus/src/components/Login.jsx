import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const googleButtonRef = useRef(null);

  const { backendUrl, setToken } = useContext(AppContext);
  const { clearCart } = useCart();
  const [state, setState] = useState("Login"); // or 'Sign Up'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate()

  // Google One Tap/Sign-In logic
  useEffect(() => {
    if (window.google && googleButtonRef.current && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const { credential } = response;
      if (!credential) return toast.error('Google login failed');
      if (!backendUrl) return toast.error('Backend URL not configured');
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, { token: credential });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        clearCart(); // Always start with a new cart on login
        toast.success("Logged in with Google!");
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!backendUrl) {
        toast.error("Backend URL not configured");
        return;
      }

      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        console.log("Login response:", data);

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          clearCart(); // Always start with a new cart on login
          toast.success("Logged in successfully!");
          navigate("/");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        console.log("Register response:", data);

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          clearCart(); // Always start with a new cart on sign up
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message || "Sign up failed");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-bold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="mt-1">
          Please {state === "Sign Up" ? "sign up" : "login"} to continue.
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#1c7856] text-white w-full py-2 rounded-md text-base cursor-pointer"
        >
          {state === "Sign Up" ? "Sign Up" : "Login"}
        </button>

        <div className="w-full flex flex-col items-center gap-2 mt-2">
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>
          <p className="text-xs text-zinc-400">or</p>
        </div>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-500 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-500 underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
