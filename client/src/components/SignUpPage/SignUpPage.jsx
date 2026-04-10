// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));

//     // Clear error on input change
//     setErrorMsg("");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setErrorMsg("Passwords do not match.");
//       return;
//     }

//     // Proceed with registration
//     console.log("Register Data:", formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4">
//       <div className="w-full max-w-md bg-[#1b2e31] rounded-xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-6">
//           Create an Account
//         </h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//           <div>
//             <label htmlFor="fullName" className="text-sm text-amber-200">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border  border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
//               placeholder="John Doe"
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="text-sm text-amber-200">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="text-sm text-amber-200">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
//               placeholder="••••••••"
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="text-sm text-amber-200">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
//               placeholder="••••••••"
//             />
//             {errorMsg && (
//               <p className="text-sm text-red-400 mt-1">{errorMsg}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="bg-amber-300 text-[#0e1a1c] font-bold py-2 rounded-lg hover:bg-amber-400 transition duration-300"
//           >
//             Sign Up
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-center flex justify-center gap-[8px] text-gray-400">
//           Already have an account?
//           <Link to="/login">
//             <p className="text-amber-300 underline">Login</p>
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

      const res = await axios.post("http://localhost:5000/auth/", payload);

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
          "Signup failed ",
      );
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c] px-4 py-10">
      <div className="w-full max-w-md bg-[#1b2e31] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* Username */}
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
              className="w-full p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="Enter username"
            />
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="fName" className="text-sm text-amber-200">
              First Name
            </label>
            <input
              type="text"
              id="fName"
              name="fName"
              value={formData.fName}
              onChange={handleChange}
              required
              className="w-full  p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lName" className="text-sm text-amber-200">
              Last Name
            </label>
            <input
              type="text"
              id="lName"
              name="lName"
              value={formData.lName}
              onChange={handleChange}
              required
              className="w-full  p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="Enter last name"
            />
          </div>

          {/* Email */}
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
              className="w-full  p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
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
              className="w-full  p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-sm text-amber-200">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full  p-2 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-sm text-red-400 text-center">{errorMsg}</p>
          )}

          {/* Success */}
          {successMsg && (
            <p className="text-sm text-green-400 text-center">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-300 text-[#0e1a1c] font-bold py-2 rounded-lg hover:bg-amber-400 transition duration-300"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center flex justify-center gap-2 text-gray-400">
          Already have an account?
          <Link to="/login" className="text-amber-300 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
