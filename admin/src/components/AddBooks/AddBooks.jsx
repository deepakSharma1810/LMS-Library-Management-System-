import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_IMAGE_SIZE = 1024 * 1024 * 5;

const AddBooks = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    name: "",
    author: "",
    price: "",
    mrp: "",
    actualPdf: "",
    description: "",
    stock: "",
    isbn: "",
    pages: "",
    publisher: "",
    language: "English",
    dimensions: "",
    categories: [],
  });

  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH AUTHORS =================
  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(res.data.authors);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load authors");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      console.log(res.data);

      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // ================= IMAGE CHANGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5MB");
      e.target.value = "";
      setImage(null);
      setPreview(null);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!book.name || !book.author || !book.price || !book.mrp) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      let imagePath = "";

      // upload image first
      if (image) {
        const formData = new FormData();
        formData.append("ImageData", image);

        const uploadImage = await axios.post(
          "http://localhost:5000/uploadmulter",
          formData,
        );

        imagePath = uploadImage.data.file;
      }

      // save book
      await axios.post("http://localhost:5000/book", {
        ...book,
        coverPhoto: imagePath,
      });

      // reset
      setBook({
        name: "",
        author: "",
        price: "",
        mrp: "",
        actualPdf: "",
        description: "",
        stock: "",
        isbn: "",
        pages: "",
        publisher: "",
        language: "English",
        dimensions: "",
        categories: [],
      });

      setImage(null);
      setPreview(null);
      setLoading(false);

      navigate("/books");
    } catch (err) {
      console.error(err);
      setLoading(false);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add book");
      }
    }
  };

  const discount =
    book.mrp && book.price
      ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
      : 0;

  return (
    <div className="min-h-screen w-full bg-[#0e1a1c] flex mt-20">
      {/* LEFT FORM */}
      <div className="w-full lg:w-2/3 p-6">
        <div className="max-w-2xl bg-[#1b2e31] rounded-2xl shadow-2xl p-8 border border-[#2c4449]">
          <h1 className="text-2xl font-bold text-[#dbf8fa] mb-1">
            Add New Book
          </h1>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={book.name}
              onChange={handleChange}
              placeholder="Book Name"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <select
              name="author"
              value={book.author}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="number"
              name="mrp"
              value={book.mrp}
              onChange={handleChange}
              placeholder="MRP"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <select
              name="categories"
              value={book.categories[0] || ""}
              onChange={(e) =>
                setBook({ ...book, categories: [e.target.value] })
              }
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="number"
              name="stock"
              value={book.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="text"
              name="isbn"
              value={book.isbn}
              onChange={handleChange}
              placeholder="ISBN"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="number"
              name="pages"
              value={book.pages}
              onChange={handleChange}
              placeholder="Pages"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="text"
              name="publisher"
              value={book.publisher}
              onChange={handleChange}
              placeholder="Publisher"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="text"
              name="dimensions"
              value={book.dimensions}
              onChange={handleChange}
              placeholder="Dimensions (e.g. 21.6 x 28 x 2 cm)"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="text"
              name="language"
              value={book.language}
              onChange={handleChange}
              placeholder="Language"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="text"
              name="actualPdf"
              value={book.actualPdf}
              onChange={handleChange}
              placeholder="PDF URL"
              className="w-full p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449]"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 rounded-lg bg-[#122125] text-gray-300 border border-[#2c4449]"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold ${
                loading
                  ? "bg-gray-500"
                  : "bg-amber-300 text-black hover:bg-amber-400"
              }`}
            >
              {loading ? "Saving..." : "Add Book"}
            </button>

            {error && (
              <p className="text-red-400 text-center text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <div className="hidden lg:flex w-1/3 items-center justify-center">
        <div className="w-80 bg-[#1b2e31] rounded-2xl shadow-xl p-5 border border-[#2c4449]">
          <h2 className="text-lg font-bold text-center mb-4 text-[#dbf8fa]">
            Book Preview
          </h2>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-44 object-cover rounded-lg mb-3"
            />
          ) : (
            <div className="w-full h-44 bg-[#122125] rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <h3 className="font-semibold text-[#dbf8fa] mt-3">
            {book.name || "Book Name"}
          </h3>

          <p className="text-sm text-gray-400">Price: ₹{book.price || 0}</p>

          <p className="text-sm text-gray-400">MRP: ₹{book.mrp || 0}</p>

          <p className="text-sm text-green-400">{discount}% OFF</p>

          <p className="text-sm text-gray-400">Stock: {book.stock || 0}</p>

          <p className="text-sm text-gray-400">
            Size: {book.dimensions || "N/A"}
          </p>

          {book.actualPdf && (
            <a
              href={book.actualPdf}
              target="_blank"
              rel="noreferrer"
              className="block mt-3 text-center text-amber-300 hover:underline"
            >
              View PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBooks;
