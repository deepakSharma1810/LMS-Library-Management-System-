import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaLock } from "react-icons/fa";
import {
  FiCamera,
  FiX,
  FiCheck,
  FiLogOut,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  showToggle = false,
  showPassword,
  setShowPassword,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] text-[#4a8a92] uppercase tracking-wider">
      {label}
    </label>

    <div className="relative">
      <input
        type={showToggle ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 pr-12 bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition"
      />

      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6bbcc4] hover:text-amber-400 z-10 cursor-pointer"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const [pwdState, setPwdState] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });

  const [pwdMsg, setPwdMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !loggedInUser) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);
    setForm(loggedInUser);
    setAvatarPreview(loggedInUser.avatar || "");
  }, [navigate]);

  const fullName = `${user?.fName || ""} ${user?.lName || ""}`.trim();

  // const onFileChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const url = URL.createObjectURL(file);
  //   setAvatarPreview(url);
  //   setAvatarError(false);
  //   setForm((prev) => ({ ...prev, avatar: file }));
  // };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;

      setAvatarPreview(base64Image);
      setAvatarError(false);

      setForm((prev) => ({
        ...prev,
        avatar: base64Image,
      }));
    };

    reader.readAsDataURL(file);
  };

  const startEdit = () => {
    setForm(user);
    setAvatarPreview(user?.avatar || "");
    setAvatarError(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(user);
    setAvatarPreview(user?.avatar || "");
    setEditing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeProfileImage = () => {
    setAvatarPreview("");
    setAvatarError(false);

    setForm((prev) => ({
      ...prev,
      avatar: "",
    }));

    const updatedUser = {
      ...user,
      avatar: "",
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // const saveProfile = () => {
  //   if (!form.fName?.trim()) return alert("First name is required");
  //   if (!form.lName?.trim()) return alert("Last name is required");
  //   if (!form.email?.trim()) return alert("Email is required");

  //   setSaving(true);

  //   const updatedUser = {
  //     ...form,
  //     avatar: typeof form.avatar === "string" ? form.avatar : avatarPreview,
  //   };

  //   setUser(updatedUser);
  //   localStorage.setItem("user", JSON.stringify(updatedUser));

  //   setTimeout(() => {
  //     setEditing(false);
  //     setSaving(false);
  //     if (fileRef.current) fileRef.current.value = "";
  //   }, 500);
  // };

  const saveProfile = () => {
    if (!form.fName?.trim()) return alert("First name is required");
    if (!form.lName?.trim()) return alert("Last name is required");
    if (!form.email?.trim()) return alert("Email is required");

    setSaving(true);

    const updatedUser = {
      ...user,
      ...form,
      avatar: form.avatar || avatarPreview || "",
    };

    setUser(updatedUser);
    setAvatarPreview(updatedUser.avatar || "");
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setTimeout(() => {
      setEditing(false);
      setSaving(false);
      if (fileRef.current) fileRef.current.value = "";
    }, 500);
  };

  const handlePwdChange = async () => {
    try {
      setPwdMsg("");

      if (!pwdState.current || !pwdState.newPwd || !pwdState.confirm) {
        setPwdMsg("Please fill all password fields.");
        return;
      }

      if (pwdState.newPwd !== pwdState.confirm) {
        setPwdMsg("Passwords do not match.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/auth/change-password",
        {
          uName: user.uName,
          currentPassword: pwdState.current,
          newPassword: pwdState.newPwd,
        },
      );

      setPwdMsg(res.data.message || "Password changed successfully!");
      setPwdState({ current: "", newPwd: "", confirm: "" });

      setTimeout(() => {
        setPwdMsg("");
      }, 2000);
    } catch (error) {
      setPwdMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#dbf8fa]">Your Profile</h1>
            <p className="text-sm text-[#4a8a92] mt-1">
              Manage your personal information
            </p>
          </div>

          {!editing ? (
            <button
              onClick={startEdit}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-500 transition cursor-pointer"
            >
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-500 transition disabled:opacity-60 cursor-pointer"
              >
                <FiCheck /> {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162428] border border-[#1f3a3e] text-[#dbf8fa] text-sm hover:border-amber-400/40 transition cursor-pointer"
              >
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-[#162428] to-[#0f1d20] rounded-3xl border border-[#1f3a3e] p-8 flex flex-col items-center gap-6 shadow-xl">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-400/40 bg-[#1f3338] shadow-lg">
                {avatarPreview && !avatarError ? (
                  <img
                    src={avatarPreview}
                    alt=""
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-amber-400">
                    {user?.fName?.[0] || user?.uName?.[0] || "U"}
                  </div>
                )}
              </div>

              {editing && (
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-[#0e1a1c] border border-amber-400/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1f3338] transition">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <FiCamera className="text-amber-400 text-sm" />
                </label>
              )}
            </div>
            {editing && avatarPreview && (
              <button
                type="button"
                onClick={removeProfileImage}
                className="text-xs px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition cursor-pointer"
              >
                Remove Photo
              </button>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#dbf8fa]">
                {fullName || "User"}
              </h2>
              <p className="text-sm text-[#6bbcc4] mt-2">@{user?.uName}</p>
              <p className="text-xs text-[#4a8a92] mt-1">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/15 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          <div className="md:col-span-2 space-y-5">
            <div className="bg-[#162428] rounded-3xl border border-[#1f3a3e] p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#dbf8fa] mb-5">
                Basic Information
              </h3>

              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="First Name" value={user?.fName} />
                  <InfoCard label="Last Name" value={user?.lName} />
                  <InfoCard label="Username" value={user?.uName} />
                  <InfoCard label="Email" value={user?.email} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={form.fName || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fName: e.target.value }))
                    }
                  />

                  <Input
                    label="Last Name"
                    value={form.lName || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lName: e.target.value }))
                    }
                  />

                  <Input
                    label="Username"
                    value={form.uName || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, uName: e.target.value }))
                    }
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="bg-[#162428] rounded-3xl border border-[#1f3a3e] p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#dbf8fa]">
                    Security
                  </h3>
                  <p className="text-xs text-[#4a8a92] mt-1">
                    Change your account password
                  </p>
                </div>

                <button
                  onClick={() => setShowPwd((prev) => !prev)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0e1a1c] border border-[#1f3a3e] text-[#6bbcc4] text-xs hover:text-amber-300 hover:border-amber-400/30 transition cursor-pointer"
                >
                  <FaLock className="text-xs" />
                  {showPwd ? "Hide" : "Change Password"}
                </button>
              </div>

              {showPwd && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Current Password"
                    showToggle
                    showPassword={showCurrentPwd}
                    setShowPassword={setShowCurrentPwd}
                    placeholder="Current password"
                    value={pwdState.current}
                    onChange={(e) =>
                      setPwdState((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />

                  <Input
                    label="New Password"
                    showToggle
                    showPassword={showNewPwd}
                    setShowPassword={setShowNewPwd}
                    placeholder="New password"
                    value={pwdState.newPwd}
                    onChange={(e) =>
                      setPwdState((prev) => ({
                        ...prev,
                        newPwd: e.target.value,
                      }))
                    }
                  />

                  <Input
                    label="Confirm Password"
                    showToggle
                    showPassword={showConfirmPwd}
                    setShowPassword={setShowConfirmPwd}
                    placeholder="Confirm password"
                    value={pwdState.confirm}
                    onChange={(e) =>
                      setPwdState((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                  />

                  <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                    <button
                      onClick={handlePwdChange}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-500 transition cursor-pointer"
                    >
                      Update Password
                    </button>

                    {pwdMsg && (
                      <p
                        className={`text-xs ${
                          pwdMsg.includes("success")
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {pwdMsg}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-[#0e1a1c] border border-[#1f3a3e] hover:border-amber-400/30 rounded-2xl px-5 py-4 transition">
    <p className="text-[10px] text-[#4a8a92] uppercase tracking-wider">
      {label}
    </p>
    <p className="text-sm md:text-base text-[#dbf8fa] font-medium mt-1 break-all">
      {value || "N/A"}
    </p>
  </div>
);

export default ProfilePage;
