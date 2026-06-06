import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnterOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      setError("Session expired. Try again");

      setTimeout(() => setError(""), 2000);
      return;
    }

    if (!otp) {
      setError("OTP is required");

      setTimeout(() => setError(""), 2000);
      return;
    }

    if (otp.length !== 6) {
      setError("Invalid OTP");

      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "https://lms-library-management-system-9nhw.onrender.com/auth/verify-otp",
        {
          email: email.trim(),
          otp: otp.trim(),
        },
      );

      console.log("API:", res.data);

      if (res.data.message === "OTP verified successfully") {
        navigate("/confirm-password");
      } else {
        setError("Invalid OTP");

        setTimeout(() => setError(""), 2000);
      }
    } catch (err) {
      console.log("ERROR:", err.response?.data);

      const msg = err.response?.data?.message || "OTP verification failed";

      setError(msg);

      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Enter OTP
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength="6"
            placeholder="••••••"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setError("");
            }}
            className="w-full text-center text-2xl tracking-widest bg-[#122125] border border-[#2c4449] rounded-lg py-3 text-white outline-none focus:ring-2 focus:ring-amber-300"
          />

          {error && (
            <p className="text-sm text-red-400 text-center transition-all duration-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-60"
          >
            {loading && (
              <span className=" w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOtp;
