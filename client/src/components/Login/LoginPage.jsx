import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        formData,
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login Successful");

      const role = res.data.user.role;

      setTimeout(() => {
        if (role === "super_admin") {
          navigate("/super-admin-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4">
      <div className="w-full max-w-md bg-[#1b2e31] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="uName" className="text-sm text-amber-200">
              Username
            </label>
            <input
              type="text"
              id="uName"
              name="uName"
              value={formData.uName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Enter username"
            />
          </div>
          {/* --------- */}
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

          {/* {message && (
            <p className="text-sm text-green-400 text-center">{message}</p>
          )} */}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-300 text-[#0e1a1c] font-bold py-2 rounded-lg hover:bg-amber-400 transition duration-300"
          >
            {loading ? "Logging in" : "Login"}
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
