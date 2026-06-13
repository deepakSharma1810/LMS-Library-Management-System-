import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import API_URL from "../../Constant";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uName: "",
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;

    if (!usernameRegex.test(formData.uName.trim())) {
      setErrorMsg(
        "Username must start with a letter and contain only letters, numbers, underscore (_) or dot (.)",
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid Gmail address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        uName: formData.uName,
        fName: formData.fName,
        lName: formData.lName,
        email: formData.email,
        password: formData.password,
      };

      await axios.post(`${API_URL}/auth/`, payload);

      setSuccessMsg("Account created successfully");

      setFormData({
        uName: "",
        fName: "",
        lName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Signup failed",
      );

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-[#162428] border border-[#1f3a3e] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-xl text-amber-300" />
            </div>

            <h2 className="text-2xl font-bold text-[#dbf8fa] tracking-tight">
              Create an Account
            </h2>

            <p className="text-xs text-[#4a8a92] mt-1">
              Join us and start reading today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="uName"
                className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
              >
                Username
              </label>

              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type="text"
                  id="uName"
                  name="uName"
                  value={formData.uName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-3"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="fName"
                  className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="fName"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 px-3"
                  placeholder="First name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="lName"
                  className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="lName"
                  name="lName"
                  value={formData.lName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 px-3"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
              >
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-3"
                  placeholder="you@example.com"
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
                  type={showPwd ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-10"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a8a92] hover:text-amber-300 transition"
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] text-[#4a8a92] uppercase tracking-wider"
              >
                Confirm Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-sm" />

                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition py-2.5 pl-9 pr-10"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a8a92] hover:text-amber-300 transition"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2 text-center">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 rounded-xl bg-amber-400 text-black font-bold text-sm hover:bg-amber-500 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}

              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-[#4a8a92]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
