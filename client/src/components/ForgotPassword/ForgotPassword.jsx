import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "https://lms-library-management-system-9nhw.onrender.com/auth/forgot-password",
        { email: email.trim() },
      );

      console.log(res);

      setLoading(false);

      if (res.status === 200) {
        setSent(true);
        localStorage.setItem("resetEmail", email.trim());
        setTimeout(() => navigate("/enter-otp"), 1200);
      }
    } catch (err) {
      setLoading(false);

      setError(
        err.response?.data?.message || err.message || "Failed to send OTP",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#162428] border border-[#1f3a3e] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center mx-auto mb-3">
              <FiMail className="text-xl text-amber-300" />
            </div>

            <h2 className="text-2xl font-bold text-[#dbf8fa] tracking-tight">
              Forgot Password
            </h2>

            <p className="text-xs text-[#4a8a92] mt-1">
              Enter your email to receive an OTP
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#4a8a92] uppercase tracking-wider">
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-3"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                {error}
              </div>
            )}

            {sent && (
              <div className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2 text-center">
                OTP sent! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={loading || sent}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-black font-bold text-sm py-2.5 rounded-xl hover:bg-amber-500 transition disabled:opacity-60 cursor-pointer"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}

              {loading ? "Sending..." : sent ? "OTP Sent ✓" : "Send OTP"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#4a8a92] hover:text-amber-300 transition"
            >
              <FiArrowLeft className="text-xs" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
