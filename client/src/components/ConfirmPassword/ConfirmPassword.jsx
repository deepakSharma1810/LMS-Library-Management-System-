import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import axios from "axios";
import API_URL from "../../Constant";

const ConfirmPassword = () => {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      showError("Session expired. Try again");
      return;
    }

    if (!passwords.password || !passwords.confirmPassword) {
      showError("All fields are required");
      return;
    }

    if (passwords.password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        password: passwords.password,
      });

      console.log("RESET:", res.data);

      if (res.status === 200) {
        // cleanup
        localStorage.removeItem("resetEmail");

        console.log("Password updated successfully");

        navigate("/login");
      }
    } catch (err) {
      console.log(err.response?.data);

      showError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
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
          {/* Password */}
          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-transparent outline-none text-white px-2 py-2"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  password: e.target.value,
                })
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-transparent outline-none text-white px-2 py-2"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-300 text-[#0e1a1c] py-2 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-60"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmPassword;
