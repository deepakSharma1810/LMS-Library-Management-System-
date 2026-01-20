import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBooks = () => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    name: "",
    author: "",
    price: "",
    actualPdf: "",
  });

  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* FETCH AUTHORS (for dropdown) */
  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load authors");
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!book.name || !book.author || !book.price) {
      setError("Please fill all the feilds");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let imagePath = "";

      // upload image
      if (image) {
        const formData = new FormData();
        formData.append("ImageData", image);

        const uploadImage = await axios.post(
          "http://localhost:5000/uploadmulter",
          formData
        );

        console.log(uploadImage);

        imagePath = uploadImage.data.file;
      }

      // save book
      await axios.post("http://localhost:5000/book", {
        name: book.name,
        author: book.author,
        price: book.price,
        actualPdf: book.actualPdf,
        coverPhoto: imagePath,
      });

      // reset
      setBook({
        name: "",
        author: "",
        price: "",
        actualPdf: "",
      });
      setImage(null);
      setPreview(null);

      navigate("/books");
    } catch (err) {
      console.error(err);
      setError("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0e1a1c] flex mt-20">
      {/* LEFT – FORM */}
      <div className="w-full lg:w-2/3 p-6">
        <div className="max-w-2xl bg-[#1b2e31] rounded-2xl shadow-2xl p-8 border border-[#2c4449]">
          <h1 className="text-2xl font-bold text-[#dbf8fa] mb-1">
            Add New Book
          </h1>
          <p className="text-sm text-gray-400 mb-3">
            Enter book details to add it to the library
          </p>

          <div className="space-y-1">
            {/* Book Name */}
            <div>
              <label className="text-sm text-amber-200">Book Name</label>
              <input
                type="text"
                name="name"
                value={book.name}
                onChange={handleChange}
                placeholder="Enter book name"
                className="w-full mt-1 p-3 rounded-lg bg-[#122125] text-white
                border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Author */}
            <div>
              <label className="text-sm text-amber-200">Author</label>
              <select
                name="author"
                value={book.author}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg bg-[#122125] text-white border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="" className="text-gray-400">
                  {" "}
                  Select Author
                </option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm text-amber-200">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={book.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full mt-1 p-3 rounded-lg bg-[#122125] text-white
                border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm text-amber-200">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-1 p-2 rounded-lg bg-[#122125] text-gray-300
                border border-[#2c4449]"
              />
            </div>

            {/* PDF */}
            <div>
              <label className="text-sm text-amber-200">PDF URL</label>
              <input
                type="text"
                name="actualPdf"
                value={book.actualPdf}
                onChange={handleChange}
                placeholder="https://example.com/book.pdf"
                className="w-full mt-1 p-3 rounded-lg bg-[#122125] text-white
                border border-[#2c4449] focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full mt-2 font-semibold py-3 rounded-lg transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-amber-300 text-[#0e1a1c] hover:bg-amber-400"
              }`}
            >
              {loading ? "Saving..." : "Add Book"}
            </button>

            {/* error */}
            {error && (
              <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT – LIVE PREVIEW */}
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

          <p className="text-sm text-gray-400">
            Author: {book.author || "Author"}
          </p>

          <p className="text-sm text-gray-400">Price: ₹{book.price || "0"}</p>

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
