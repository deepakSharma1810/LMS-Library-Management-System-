import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const navigate = useNavigate();

  /* PROFILE STATE */
  const [profile, setProfile] = useState({
    name: "Deepak Sharma",
    email: "admin@email.com",
  });

  /* PASSWORD STATE */
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* UPDATE PROFILE */
  const updateProfile = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
    setSuccess("Profile updated successfully");
    setTimeout(() => setSuccess(""), 2000);
  };

  /* CHANGE PASSWORD */
  const changePassword = (e) => {
    e.preventDefault();

    if (passwords.newPass !== passwords.confirm) {
      setError("Passwords do not match");
      return;
    }

    console.log("Password Changed:", passwords);
    setError("");
    setSuccess("Password updated successfully");
    setPasswords({ current: "", newPass: "", confirm: "" });

    setTimeout(() => setSuccess(""), 2000);
  };

  /* LOGOUT */
  const logout = () => {
    console.log("Admin logged out");
    navigate("/admin-login");
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen mt-20 space-y-8">
      <h2 className="text-2xl font-bold text-[#dbf8fa]">Settings</h2>

      {/* SUCCESS / ERROR */}
      {success && (
        <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-900/30 text-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* PROFILE SETTINGS */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#dbf8fa] mb-4">
          Profile Settings
        </h3>

        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <label className="text-sm text-amber-200">Name</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiUser className="text-gray-400" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-amber-200">Email</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full bg-transparent outline-none text-white px-2 py-2"
              />
            </div>
          </div>

          <button className="bg-amber-300 text-[#0e1a1c] px-5 py-2 rounded-lg font-semibold hover:bg-amber-400">
            Save Profile
          </button>
        </form>
      </div>

      {/* PASSWORD SETTINGS */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#dbf8fa] mb-4">
          Change Password
        </h3>

        <form onSubmit={changePassword} className="space-y-4">
          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full bg-transparent outline-none text-white px-2 py-2"
            />
          </div>

          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              className="w-full bg-transparent outline-none text-white px-2 py-2"
            />
          </div>

          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full bg-transparent outline-none text-white px-2 py-2"
            />
          </div>

          <button className="bg-amber-300 text-[#0e1a1c] px-5 py-2 rounded-lg font-semibold hover:bg-amber-400">
            Update Password
          </button>
        </form>
      </div>

      {/* LOGOUT */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-6 flex justify-between items-center">
        <p className="text-gray-400">Logout from admin panel</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
