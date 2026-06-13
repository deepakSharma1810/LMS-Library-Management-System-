import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock, FiLogIn } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API_URL from "../../Constant";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [formData, setFormData] = useState({
    loginId: "",
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

    if (!formData.loginId.trim() || !formData.password.trim()) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const payload = {
        loginId: formData.loginId.trim(),
        password: formData.password,
      };

      const res = await axios.post(`${API_URL}/auth/login`, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);

      setMessage("Login Successful");

      const role = res.data.user.role;

      setTimeout(() => {
        setLoading(false);

        if (from) {
          navigate(from, { replace: true });
        } else if (role === "super_admin") {
          navigate("/super-admin-dashboard");
        } else if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (error) {
      console.log("FULL ERROR:", error.response?.data);

      setLoading(false);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Incorrect username or password",
      );

      // setTimeout(() => {
      //   setError("");
      // }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-[#162428] border border-[#1f3a3e] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center mx-auto mb-3">
              <FiLogIn className="text-xl text-amber-300" />
            </div>

            <h2 className="text-2xl font-bold text-[#dbf8fa] tracking-tight">
              Login to Your Account
            </h2>

            <p className="text-xs text-[#4a8a92] mt-1">
              Welcome back, please enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="loginId"
                className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
              >
                Username or Email
              </label>

              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type="text"
                  id="loginId"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleChange}
                  required
                  className={`w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-3 ${error ? "border-red-500" : ""}`}
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
              >
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-10 ${error ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a8a92] hover:text-amber-300 transition cursor-pointer"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {error && (
                <div className="text-xs text-red-400 mt-1">{error}</div>
              )}
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                {error}
              </div>
            )} */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-sm hover:bg-amber-500 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}

              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-[#4a8a92]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
