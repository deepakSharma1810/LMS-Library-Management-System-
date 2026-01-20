import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const AddUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    uName: "",
    fName: "",
    lName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", user);
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4 mt-20">
      <div className="w-full max-w-lg bg-[#1b2e31] border border-[#2c4449] rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-4">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Username */}
          <div>
            <label className="text-sm text-amber-200">Username</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
              <FiUser className="text-gray-400" />
              <input
                required
                className="w-full bg-transparent outline-none text-white px-2 py-2"
                placeholder="deepak01"
                onChange={(e) => setUser({ ...user, uName: e.target.value })}
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm text-amber-200">First Name</label>
            <input
              required
              className="w-full bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-2 text-white"
              placeholder="Deepak"
              onChange={(e) => setUser({ ...user, fName: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm text-amber-200">Last Name</label>
            <input
              className="w-full bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-2 text-white"
              placeholder="Sharma"
              onChange={(e) => setUser({ ...user, lName: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-amber-200">Email</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                required
                className="w-full bg-transparent outline-none text-white px-2 py-2"
                placeholder="user@email.com"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-amber-200">Password</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
              <FiLock className="text-gray-400" />
              <input
                type="password"
                required
                className="w-full bg-transparent outline-none text-white px-2 py-2"
                placeholder="••••••••"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="w-1/2 border border-[#2c4449] text-gray-300 py-2 rounded-lg hover:bg-[#122125]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 bg-amber-300 text-[#0e1a1c] font-semibold py-2 rounded-lg hover:bg-amber-400"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
