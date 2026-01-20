import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Send OTP to:", email);
    // API call yahan lagegi
    navigate("/enter-otp");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Enter your admin email to receive OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-amber-200">Email</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                required
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>
          </div>

          <button className="w-full bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
