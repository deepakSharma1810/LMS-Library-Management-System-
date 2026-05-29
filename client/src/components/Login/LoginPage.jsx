import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [formData, setFormData] = useState({
    uName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      localStorage.setItem("userId", res.data.user._id);

      setMessage("Login Successful");

      const role = res.data.user.role;

      setTimeout(() => {
        setLoading(false);
        if (from) {
          navigate(from, { replace: true });
        } else {
          if (role === "super_admin") {
            navigate("/super-admin-dashboard");
          } else if (role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }
      }, 500);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Invalid Credentials");

      setTimeout(() => {
        setError("");
      }, 2000);
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
              value={formData.uName || ""}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-amber-300 hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          {/* {message && (
            <p className="text-sm text-green-400 text-center">{message}</p>
          )} */}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-300 text-[#0e1a1c] font-bold py-2 rounded-lg hover:bg-amber-400 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center flex justify-center gap-[8px] text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup">
            <div className="text-amber-300 underline">Sign up</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
