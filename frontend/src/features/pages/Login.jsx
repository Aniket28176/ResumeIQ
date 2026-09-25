import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please try again.");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.....</h1>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] rounded-xl p-6 sm:p-8">

        {/* Heading */}

        <h2 className="text-lime-400 text-xl sm:text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-lime-400 text-center mb-6 text-sm sm:text-base">
          Sign in to your account
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          {/* Password */}
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-lime-400 text-sm hover:text-emerald-400 transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white text-base font-bold hover:scale-[1.01] hover:shadow-xl hover:shadow-lime-500/20 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-lime-400 hover:text-emerald-400 font-medium transition"
          >
            Register first
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
