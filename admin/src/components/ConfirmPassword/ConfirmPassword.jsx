import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const ConfirmPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log("New Password:", passwords.password);
    // Reset password API yahan lagegi
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Reset Password
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Create a new secure password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              required
              placeholder="New Password"
              className="w-full bg-transparent outline-none text-white px-2 py-2"
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
            />
          </div>

          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              required
              placeholder="Confirm Password"
              className="w-full bg-transparent outline-none text-white px-2 py-2"
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button className="w-full bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPassword;
