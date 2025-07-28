import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Your login logic here (e.g., API call)
    console.log("Login Data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4">
      <div className="w-full max-w-md bg-[#1b2e31] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="text-sm text-amber-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-amber-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-300 text-[#0e1a1c] font-bold py-2 rounded-lg hover:bg-amber-400 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center flex justify-center gap-[8px] text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup">
            <p className="text-amber-300 underline">Register</p>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
