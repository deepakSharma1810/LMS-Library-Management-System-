import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiImage, FiFileText } from "react-icons/fi";
import axios from "axios";

const AddAuthor = () => {
  const navigate = useNavigate();

  const [author, setAuthor] = useState({
    name: "",
    info: "",
    coverPhoto: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", author.name);
    formData.append("info", author.info);
    formData.append("ImageData", author.coverPhoto);

    const data = await axios.post(
      "http://localhost:5000/uploadmulter",
      formData
    );

    const saveAuth = await axios.post("http://localhost:5000/author", {
      name: author.name,
      info: author.info,
      coverPhoto: data.data.file,
    });

    console.log(saveAuth);
    navigate("/authors");
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] flex items-center justify-center px-4 mt-20">
      <div className="w-full max-w-lg bg-[#1b2e31] border border-[#2c4449] rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-2">
          Add New Author
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Fill author details carefully
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Author Name */}
          <div>
            <label className="text-sm text-amber-200 mb-1 block">
              Author Name
            </label>
            <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3">
              <FiUser className="text-gray-400" />
              <input
                type="text"
                required
                placeholder="James Clear"
                className="w-full bg-transparent outline-none text-white px-2 py-2"
                onChange={(e) => setAuthor({ ...author, name: e.target.value })}
              />
            </div>
          </div>

          {/* Author Info */}
          <div>
            <label className="text-sm text-amber-200 mb-1 block">
              Author Bio
            </label>
            <div className="flex bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-2">
              <FiFileText className="text-gray-400 mt-1" />
              <textarea
                rows="4"
                required
                placeholder="Short description about the author..."
                className="w-full bg-transparent outline-none text-white px-2 resize-none"
                onChange={(e) => setAuthor({ ...author, info: e.target.value })}
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="text-sm text-amber-200 mb-1 block">
              Author Image
            </label>
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-[#122125] border border-dashed border-[#2c4449] rounded-lg py-4 text-gray-400 hover:border-amber-300 hover:text-amber-300 transition">
              <FiImage />
              Upload Author Image
              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setAuthor({ ...author, coverPhoto: e.target.files[0] })
                }
              />
            </label>

            {author.coverPhoto && (
              <p className="text-xs text-green-400 mt-2">
                ✔ {author.coverPhoto.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/authors")}
              className="w-1/2 border border-[#2c4449] text-gray-300 py-2 rounded-lg hover:bg-[#122125]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 bg-amber-300 text-[#0e1a1c] font-semibold py-2 rounded-lg hover:bg-amber-400 transition"
            >
              Save Author
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;
