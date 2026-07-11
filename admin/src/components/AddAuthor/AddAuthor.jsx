import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Constant";

import {
  FaUserEdit,
  FaPenNib,
  FaImage,
  FaFileAlt,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

import axios from "axios";

const MAX_IMAGE_SIZE = 1024 * 1024 * 5;

const AddAuthor = () => {
  const navigate = useNavigate();

  const [author, setAuthor] = useState({
    name: "",
    role: "Author",
    bio: "",
    description: "",
    coverPhoto: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedSize, setUploadedSize] = useState("");

  const roles = [
    "Author",
    "Writer",
    "Novelist",
    "Poet",
    "Story Writer",
    "Content Writer",
    "Editor",
    "Researcher",
    "Teacher",
    "Professor",
    "Tech Writer",
    "Motivational Speaker",
  ];

  const bioPreview = useMemo(() => {
    if (!author.bio) return "Author bio will appear here…";
    return author.bio.length > 120
      ? author.bio.slice(0, 120) + "…"
      : author.bio;
  }, [author.bio]);

  const update = (key, value) => setAuthor((a) => ({ ...a, [key]: value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be less than 5MB");
      e.target.value = "";
      return;
    }
    setAuthor((a) => ({ ...a, coverPhoto: file }));
    setPreview(URL.createObjectURL(file));
    setUploadedSize((file.size / 1024).toFixed(1) + " KB");
  };

  const removeImage = () => {
    setAuthor((a) => ({ ...a, coverPhoto: null }));
    setPreview(null);
    setUploadedSize("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!author.name || !author.bio) {
      setError("Name and Bio are required");
      return;
    }

    setLoading(true);
    try {
      let imagePath = "";

      if (author.coverPhoto) {
        const formData = new FormData();
        formData.append("ImageData", author.coverPhoto);
        const uploadRes = await axios.post(`${API_URL}/uploadmulter`, formData);
        imagePath = uploadRes.data.file;
      }

      await axios.post(`${API_URL}/author`, {
        name: author.name,
        role: author.role,
        bio: author.bio,
        description: author.description,
        coverPhoto: imagePath,
      });

      navigate("/authors");
    } catch (err) {
      setError("Failed to save author. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a1c] via-[#13272a] to-[#0e1a1c] px-4 py-10 mt-20">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="rounded-2xl border border-[#2c4449]/80 bg-[#1b2e31]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-300/10 flex items-center justify-center">
                <FaUserEdit className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#dbf8fa] tracking-tight">
                  Add New Author
                </h1>
                <p className="text-xs text-[#7a9e9e]">
                  Create an author profile for your catalog
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <section className="rounded-2xl border border-[#2c4449]/80 bg-[#1b2e31]/80 backdrop-blur-xl p-6 shadow-lg">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#dbf8fa]">
                  Basic Information
                </h2>
                <p className="text-xs text-[#7a9e9e] mt-1">
                  Name, role and biography details
                </p>
              </div>

              <div className="space-y-4">
                {/* Author Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-200/90 block">
                    Author Name <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-xl px-4 py-2.5 focus-within:border-amber-300/50 focus-within:ring-1 focus-within:ring-amber-300/20 transition-all">
                    <FaUserEdit className="text-[#7a9e9e] text-sm shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. James Clear"
                      className="w-full bg-transparent outline-none text-[#dbf8fa] px-3 text-sm placeholder:text-[#5a7a7a]"
                      value={author.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-200/90 block">
                    Author Role
                  </label>
                  <div className="flex items-center bg-[#122125] border border-[#2c4449] rounded-xl px-4 py-2.5 focus-within:border-amber-300/50 focus-within:ring-1 focus-within:ring-amber-300/20 transition-all">
                    <FaPenNib className="text-[#7a9e9e] text-sm shrink-0" />
                    <select
                      value={author.role}
                      onChange={(e) => update("role", e.target.value)}
                      className="w-full bg-transparent outline-none text-[#dbf8fa] px-3 text-sm appearance-none cursor-pointer"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r} className="bg-[#122125]">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-200/90 block">
                    Author Bio <span className="text-red-400">*</span>
                  </label>
                  <div className="flex bg-[#122125] border border-[#2c4449] rounded-xl px-4 py-3 focus-within:border-amber-300/50 focus-within:ring-1 focus-within:ring-amber-300/20 transition-all">
                    <FaFileAlt className="text-[#7a9e9e] text-sm shrink-0 mt-1" />
                    <textarea
                      rows={4}
                      required
                      placeholder="Short description about the author…"
                      className="w-full bg-transparent outline-none text-[#dbf8fa] px-3 text-sm resize-none placeholder:text-[#5a7a7a]"
                      value={author.bio}
                      onChange={(e) => update("bio", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-200/90 block">
                    Full Description
                  </label>
                  <div className="flex bg-[#122125] border border-[#2c4449] rounded-xl px-4 py-3 focus-within:border-amber-300/50 focus-within:ring-1 focus-within:ring-amber-300/20 transition-all">
                    <FaFileAlt className="text-[#7a9e9e] text-sm shrink-0 mt-1" />
                    <textarea
                      rows={4}
                      placeholder="Detailed description about the author's work, achievements, background…"
                      className="w-full bg-transparent outline-none text-[#dbf8fa] px-3 text-sm resize-none placeholder:text-[#5a7a7a]"
                      value={author.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Image Upload */}
            <section className="rounded-2xl border border-[#2c4449]/80 bg-[#1b2e31]/80 backdrop-blur-xl p-6 shadow-lg">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-[#dbf8fa]">
                  Author Image
                </h2>
                <p className="text-xs text-[#7a9e9e] mt-1">
                  Upload a profile photo (PNG, JPG up to 5MB)
                </p>
              </div>

              {!author.coverPhoto ? (
                <label className="flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#122125] border-2 border-dashed border-[#2c4449] rounded-xl py-10 text-[#7a9e9e] hover:border-amber-300/60 hover:text-amber-300/80 transition-all group">
                  <div className="h-12 w-12 rounded-full bg-[#1b2e31] flex items-center justify-center group-hover:bg-amber-300/10 transition-all">
                    <FaImage className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-[#5a7a7a] mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              ) : (
                <div className="bg-[#122125] border border-[#2c4449] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <FaCheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-[#dbf8fa] font-medium">
                          {author.coverPhoto.name}
                        </p>
                        <p className="text-xs text-[#5a7a7a]">{uploadedSize}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#7a9e9e] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                <FaTimes className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/authors")}
                className="px-6 py-2.5 rounded-xl border border-[#2c4449] text-[#7a9e9e] text-sm font-medium hover:bg-[#122125] hover:text-[#dbf8fa] transition-all flex items-center gap-2"
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 rounded-xl bg-amber-300 text-[#0e1a1c] text-sm font-semibold hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    Save Author
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT — Live Preview */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-[#2c4449]/80 bg-[#1b2e31]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#dbf8fa]">
                Live Preview
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-[#5a7a7a]">
                Author Card
              </span>
            </div>

            {/* Author Card Preview */}
            <div className="rounded-xl overflow-hidden bg-[#122125] border border-[#2c4449]">
              {/* Image Area */}
              <div className="aspect-square w-full bg-[#1b2e31] relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Author preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-[#5a7a7a]">
                    <FaUserEdit className="h-12 w-12 mb-2 opacity-30" />
                    <span className="text-xs">Author photo</span>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-300/10 text-amber-300 text-[10px] font-semibold uppercase tracking-wide">
                    {author.role}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#dbf8fa]">
                  {author.name || "Author Name"}
                </h3>

                <p className="text-xs text-[#7a9e9e] leading-relaxed">
                  {bioPreview}
                </p>

                {author.description && (
                  <div className="pt-2 border-t border-[#2c4449]">
                    <p className="text-[10px] text-[#5a7a7a] uppercase tracking-wider mb-1">
                      About
                    </p>
                    <p className="text-xs text-[#7a9e9e] leading-relaxed line-clamp-3">
                      {author.description.length > 150
                        ? author.description.slice(0, 150) + "…"
                        : author.description || "Description will appear here…"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats / Meta */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#122125] border border-[#2c4449] p-3 text-center">
                <p className="text-xs text-[#5a7a7a] uppercase tracking-wider">
                  Role
                </p>
                <p className="text-sm font-semibold text-[#dbf8fa] mt-1">
                  {author.role}
                </p>
              </div>
              <div className="rounded-lg bg-[#122125] border border-[#2c4449] p-3 text-center">
                <p className="text-xs text-[#5a7a9e] uppercase tracking-wider">
                  Bio Length
                </p>
                <p className="text-sm font-semibold text-[#dbf8fa] mt-1">
                  {author.bio.length > 0 ? author.bio.length : 0} chars
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddAuthor;
