import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiLock, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../Constant";
import { useAuth } from "../../context/AuthContext";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  /* PROFILE STATE */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: `${user.fName} ${user.lName}`,
        email: user.email,
      });
    }
  }, [user]);

  /* PASSWORD STATE */
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  /* UPDATE PROFILE */
  const updateProfile = async (e) => {
    e.preventDefault();

    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const names = profile.name.trim().split(" ");

      await axios.post(`${API_URL}/auth/login`, {
        loginId: user.uName,
        password: profile.currentPassword,
      });

      const res = await axios.put(
        `${API_URL}/auth/${user.uName}`,
        {
          uName: user.uName,
          fName: names[0],
          lName: names.slice(1).join(" "),
          email: profile.email,
          password: profile.currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      setProfileSuccess("Profile updated successfully");
    } catch (err) {
      if (
        err.response?.data?.error === "Incorrect username or password" ||
        err.response?.data?.message === "Incorrect username or password"
      ) {
        setProfileError("Current password does not match.");
      } else {
        setProfileError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to update profile.",
        );
      }
    } finally {
      setProfileLoading(false);
    }
  };

  /* CHANGE PASSWORD */
  const changePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPasswordError("Please fill all the fields.");
      return;
    }

    if (passwords.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("New password and Confirm password do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          uName: user.uName,
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordSuccess(res.data.message);
      setPasswords({
        current: "",
        newPass: "",
        confirm: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Unable to change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    logout();
    navigate("/admin-signin", { replace: true });
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen mt-20 space-y-8">
      <h2 className="text-2xl font-bold text-[#dbf8fa]">Settings</h2>

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

          <label className="text-sm text-amber-200">Password</label>
          <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="Current Password"
              value={profile.currentPassword}
              className="w-full bg-transparent outline-none text-white px-2 py-2"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>

          {/* SUCCESS / ERROR */}
          {profileSuccess && (
            <div className="mb-4 rounded-lg bg-green-900/30 border border-green-500/30 px-4 py-2 text-sm text-green-400">
              {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-500/30 px-4 py-2 text-sm text-red-400">
              {profileError}
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="bg-amber-300 text-[#0e1a1c] px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-60 flex items-center gap-2"
          >
            {profileLoading && (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}

            {profileLoading ? "Saving..." : "Save Profile"}
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

          {/* SUCCESS / ERROR */}
          {passwordSuccess && (
            <div className="mb-4 rounded-lg bg-green-900/30 border border-green-500/30 px-4 py-2 text-sm text-green-400">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-500/30 px-4 py-2 text-sm text-red-400">
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-amber-300 cursor-pointer text-[#0e1a1c] px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-60 flex items-center gap-2"
          >
            {passwordLoading && (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            )}

            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* LOGOUT */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-6 flex justify-between items-center">
        <p className="text-gray-400">Logout from admin panel</p>
        <button
          onClick={handleLogout}
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
