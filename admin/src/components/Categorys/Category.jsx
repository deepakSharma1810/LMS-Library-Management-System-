import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      console.log(res.data);
      setCategories(res.data.categories || res.data);
    } catch (error) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/category/${id}`);
      fetchCategories();
    } catch (error) {
      setError("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1a1c] p-6 text-white mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Categories</h1>
          <Link
            to="/add-category"
            className="px-4 py-2 bg-amber-300 text-black rounded-lg font-semibold"
          >
            Add Category
          </Link>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-[#1b2e31] p-4 rounded-xl border border-[#2c4449] flex justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <p className="text-sm text-gray-400">{category.info}</p>
              </div>

              <button
                onClick={() => handleDelete(category._id)}
                className="px-3 py-1 bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Category;
