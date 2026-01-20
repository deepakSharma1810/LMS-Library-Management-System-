import React, { useState, useRef } from "react";
import { TbSend2 } from "react-icons/tb";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEdit,
  FaLock,
} from "react-icons/fa";

/**
 * ProfilePage.jsx
 * - Uses local mock user state. Replace with API calls (useEffect + fetch/axios) as needed.
 */

const initialUser = {
  id: 1,
  name: "Deepak Sharma",
  role: "Writer & Author",
  bio: "I write about technology, life and travel. Coffee-powered and obsessed with clean code.",
  avatar: "https://example.com/favicons/user1.png",
  followers: 12400,
  books: 34,
  email: "deepak@example.com",
  social: {
    facebook: "https://facebook.com/deepak",
    twitter: "https://twitter.com/deepak",
    instagram: "https://instagram.com/deepak",
  },
};

const ProfilePage = () => {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialUser);
  const [avatarPreview, setAvatarPreview] = useState(initialUser.avatar);
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [pwdState, setPwdState] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });
  const [pwdMsg, setPwdMsg] = useState("");

  // Handle file select -> preview
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setForm((f) => ({ ...f, avatar: file }));
  };

  const startEdit = () => {
    setForm(user);
    setAvatarPreview(user.avatar);
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(user);
    setAvatarPreview(user.avatar);
    setEditing(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const saveProfile = async () => {
    // Basic validation
    if (!form.name?.trim()) return alert("Name is required.");
    setSaving(true);

    // Simulate API upload delay
    setTimeout(() => {
      // If avatar is a File, normally you'd upload it and receive a URL.
      // Here we simulate that by using avatarPreview (object URL).
      const updated = {
        ...form,
        avatar: typeof form.avatar === "string" ? form.avatar : avatarPreview,
      };
      setUser(updated);
      setEditing(false);
      setSaving(false);
      if (fileRef.current) fileRef.current.value = "";
      console.log(
        "Profile saved (simulated). Replace with API call to persist."
      );
    }, 900);
  };

  const handlePwdChange = () => {
    setPwdMsg("");
    if (!pwdState.current || !pwdState.newPwd) {
      setPwdMsg("Please fill all password fields.");
      return;
    }
    if (pwdState.newPwd !== pwdState.confirm) {
      setPwdMsg("New password and confirm password do not match.");
      return;
    }
    // Simulate password change
    setTimeout(() => {
      setPwdMsg("Password changed successfully (simulated).");
      setPwdState({ current: "", newPwd: "", confirm: "" });
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#dbf8fa]">Your Profile</h1>
          <div className="flex items-center gap-3">
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded bg-amber-400 text-black font-medium hover:bg-amber-500"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-amber-400 text-black font-medium hover:bg-amber-500 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded bg-transparent border border-gray-700 text-gray-200"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Avatar + Stats */}
          <div className="bg-[#122125] rounded-xl p-5 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={avatarPreview}
                alt={user.name}
                className="w-36 h-36 rounded-full object-cover border-2 border-amber-200"
              />
              {editing && (
                <label
                  className="absolute bottom-0 right-0 p-2 bg-[#0f2b2b] rounded-full cursor-pointer border border-gray-700"
                  title="Change avatar"
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </label>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#dbf8fa]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-300">{user.role}</p>
            </div>

            <div className="w-full grid grid-cols-3 gap-2 mt-2">
              <div className="text-center">
                <p className="text-lg font-semibold text-amber-300">
                  {user.books}
                </p>
                <p className="text-xs text-gray-400">Books</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-amber-300">
                  {user.followers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-amber-300">4.8</p>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
            </div>

            <div className="w-full mt-3">
              <button className="w-full px-4 py-2 rounded bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800">
                View Public Profile
              </button>
              <button className="w-full mt-2 px-4 py-2 rounded bg-transparent border border-red-700 text-red-300 hover:bg-red-900/10">
                Logout
              </button>
            </div>
          </div>

          {/* RIGHT: Info and Settings */}
          <div className="md:col-span-2 bg-[#122125] rounded-xl p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-[#dbf8fa] mb-3">
                Basic Info
              </h3>

              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Full name</p>
                    <p className="text-sm text-gray-100">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-100">{user.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-400">Bio</p>
                    <p className="text-sm text-gray-100 mt-1">{user.bio}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Full name</p>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 outline-none text-gray-200"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      type="email"
                      className="w-full mt-1 px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 outline-none text-gray-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-400">Bio</p>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bio: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 outline-none text-gray-200"
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Socials */}
            <div>
              <h3 className="text-lg font-semibold text-[#dbf8fa] mb-3">
                Social Links
              </h3>
              {!editing ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <a
                    href={user.social.facebook}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Facebook
                  </a>
                  <a
                    href={user.social.twitter}
                    className="text-sm text-sky-400 hover:underline"
                  >
                    Twitter
                  </a>
                  <a
                    href={user.social.instagram}
                    className="text-sm text-pink-400 hover:underline"
                  >
                    Instagram
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={form.social.facebook}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        social: { ...f.social, facebook: e.target.value },
                      }))
                    }
                    className="px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                    placeholder="Facebook URL"
                  />
                  <input
                    value={form.social.twitter}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        social: { ...f.social, twitter: e.target.value },
                      }))
                    }
                    className="px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                    placeholder="Twitter URL"
                  />
                  <input
                    value={form.social.instagram}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        social: { ...f.social, instagram: e.target.value },
                      }))
                    }
                    className="px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                    placeholder="Instagram URL"
                  />
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* <div>
                <h3 className="text-lg font-semibold text-[#dbf8fa]">
                  Security
                </h3>
                <p className="text-sm text-gray-400">Change your password</p>
              </div> */}

              {/* <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  placeholder="Current password"
                  type="password"
                  value={pwdState.current}
                  onChange={(e) =>
                    setPwdState((s) => ({ ...s, current: e.target.value }))
                  }
                  className="px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                />
                <input
                  placeholder="New password"
                  type="password"
                  value={pwdState.newPwd}
                  onChange={(e) =>
                    setPwdState((s) => ({ ...s, newPwd: e.target.value }))
                  }
                  className="px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="Confirm"
                    type="password"
                    value={pwdState.confirm}
                    onChange={(e) =>
                      setPwdState((s) => ({ ...s, confirm: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 bg-[#0f1f21] rounded border border-gray-700 text-gray-200"
                  />
                  <button
                    onClick={handlePwdChange}
                    className="px-3 py-2 bg-transparent border border-gray-700 rounded text-gray-200"
                    title="Change password"
                  >
                    <FaLock />
                  </button>
                </div>
              </div> */}
            </div>

            {pwdMsg && <p className="text-sm text-green-300">{pwdMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
