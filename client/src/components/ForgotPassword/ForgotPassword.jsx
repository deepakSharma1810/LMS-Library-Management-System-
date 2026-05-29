import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        "http://localhost:5000/auth/forgot-password",
        {
          email: email.trim(),
        },
      );
      console.log(res);

      // save email for next step
      setLoading(false);

      if (res.status === 200) {
        localStorage.setItem("resetEmail", email.trim());
        navigate("/enter-otp");
      }
    } catch (err) {
      setLoading(false);

      (console.log("ERROR:", err),
        setError(
          err.response?.data?.message || err.message || "Failed to send OTP",
        ));

      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-amber-200">Email</label>

            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiMail className="text-gray-400" />

              <input
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-60"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
