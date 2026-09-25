import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";

export default function Register() {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Please try again.");
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
        <h2 className="text-mauve-100 text-xl sm:text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-mauve-400 text-center mb-6 text-sm sm:text-base">
          Register a new account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="w-full h-12 px-5 rounded-2xl bg-[#202020] border-2 border-[#383838] outline-none text-white text-base placeholder:text-gray-600 focus:border-lime-500 transition"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 text-white text-base font-bold hover:scale-[1.01] hover:shadow-xl hover:shadow-lime-500/20 transition"
          >
            {loading ? "Creating Account..." : "Register →"}
          </button>
        </form>

        {/* NEW: Link back to Login */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-lime-400 hover:text-emerald-400 font-medium transition"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}