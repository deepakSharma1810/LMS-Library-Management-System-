import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    info: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category.name || !category.info) {
      setError("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("info", category.info);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/category", category);
      navigate("/categories");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] p-6 text-white mt-20">
      <div className="max-w-xl mx-auto bg-[#1b2e31] p-6 rounded-2xl border border-[#2c4449]">
        <h1 className="text-2xl font-bold mb-4">Add Category</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Category name"
            className="w-full p-3 rounded-lg bg-[#122125] border border-[#2c4449]"
          />

          <textarea
            name="info"
            value={category.info}
            onChange={handleChange}
            placeholder="Category info"
            rows="4"
            className="w-full p-3 rounded-lg bg-[#122125] border border-[#2c4449]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-amber-300 text-black font-semibold"
          >
            {loading ? "Saving..." : "Add Category"}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
