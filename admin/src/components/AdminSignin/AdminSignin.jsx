import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

const AdminSignin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    // 👉 Backend login API yahan lagegi
    console.log("Admin Login:", formData);

    // TEMP: successful login
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b2e31] border border-[#2c4449] rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-1">
          Admin Sign In
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Login with admin credentials
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-amber-200">Email</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="admin@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-amber-200">Password</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiLock className="text-gray-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-amber-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-amber-300 text-[#0e1a1c] font-semibold py-2 rounded-lg hover:bg-amber-400 transition"
          >
            Admin Sign In
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-5 text-sm text-center text-gray-400">
          Not an Admin?{" "}
          <Link to="/" className="text-amber-300 underline">
            Go to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignin;
