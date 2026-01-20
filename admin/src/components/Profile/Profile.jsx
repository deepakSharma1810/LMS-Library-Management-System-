import React, { useState } from "react";
import { FiMail, FiUser, FiEdit } from "react-icons/fi";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "Deepak Sharma",
    email: "admin@email.com",
    role: "Administrator",
    avatar: "",
  });

  const [preview, setPreview] = useState(null);

  /* HANDLE IMAGE */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile({ ...profile, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  /* SAVE PROFILE */
  const saveProfile = () => {
    console.log("Updated Profile:", profile);
    setEditMode(false);
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen mt-20">
      <div className="max-w-3xl mx-auto bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#dbf8fa]">Admin Profile</h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-400"
          >
            <FiEdit />
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* PROFILE TOP */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-amber-300 flex items-center justify-center text-[#0e1a1c] text-3xl font-bold overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                "DS"
              )}
            </div>

            {editMode && (
              <label className="absolute bottom-0 right-0 bg-[#122125] border border-[#2c4449] text-amber-300 px-2 py-1 text-xs rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <p className="text-gray-400 text-sm">{profile.role}</p>
        </div>

        {/* PROFILE DETAILS */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="text-sm text-amber-200">Name</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiUser className="text-gray-400" />
              <input
                type="text"
                disabled={!editMode}
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-transparent outline-none text-white px-2 py-2 disabled:text-gray-400"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-amber-200">Email</label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 mt-1">
              <FiMail className="text-gray-400" />
              <input
                type="email"
                disabled={!editMode}
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full bg-transparent outline-none text-white px-2 py-2 disabled:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        {editMode && (
          <div className="flex justify-end mt-6">
            <button
              onClick={saveProfile}
              className="bg-amber-300 text-[#0e1a1c] px-6 py-2 rounded-lg font-semibold hover:bg-amber-400"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
