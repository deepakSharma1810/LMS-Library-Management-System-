import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp);
    // OTP verify API yahan lagegi
    navigate("/confirm-password");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Enter OTP
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength="6"
            required
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-2xl tracking-widest bg-[#122125] border border-[#2c4449] rounded-lg py-3 text-white outline-none focus:ring-2 focus:ring-amber-300"
          />

          <button className="w-full bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOtp;
