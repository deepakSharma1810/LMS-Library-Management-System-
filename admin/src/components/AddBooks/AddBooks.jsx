import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileImage,
  FaFilePdf,
  FaBook,
  FaTimes,
  FaCheckCircle,
  FaTag,
  FaBoxOpen,
  FaRupeeSign,
  FaArrowLeft,
} from "react-icons/fa";
import API_URL from "../../Constant";

const MAX_IMAGE_SIZE = 1024 * 1024 * 5;
const MAX_PDF_SIZE = 1024 * 1024 * 20;

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

    bookType: "physical",

    isNew: false,
    isPopular: false,
  });

  const [authors, setAuthors] = useState([]);
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchAuthors = async () => {
    try {
      const res = await axios.get(`${API_URL}/author`);
      setAuthors(res.data.authors);
    } catch (err) {
      console.log(err);
      setError("Failed to load authors");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/category`);
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleDimensionChange = (value) => {
    setBook({ ...book, dimensions: value });
  };

  const handleDimensionBlur = () => {
    if (!book.dimensions) return;
    const nums = book.dimensions.match(/\d+/g);
    if (!nums) {
      setBook({ ...book, dimensions: "" });
      return;
    }
    setBook({ ...book, dimensions: nums.join(" x ") + " cm" });
  };

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

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setError("");
    if (!file) return;
    if (file.size > MAX_PDF_SIZE) {
      setError("Pdf size must be less than 20 MB");
      e.target.value = "";
      setPdf(null);
      return;
    }
    setPdf(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!book.name || !book.author || !book.price || !book.mrp) {
      setError("Please fill all required fields");
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    try {
      let imagePath = "";
      let pdfPath = "";

      if (pdf) {
        const pdfData = new FormData();
        pdfData.append("pdf", pdf);
        const uploadPdf = await axios.post(`${API_URL}/upload-pdf`, pdfData);
        pdfPath = uploadPdf.data.file;
      }

      if (image) {
        const formData = new FormData();
        formData.append("ImageData", image);
        const uploadImage = await axios.post(
          `${API_URL}/uploadmulter`,
          formData,
        );
        imagePath = uploadImage.data.file;
      }

      console.log("Book Data:", book);
      console.log("Book Type:", book.bookType);

      await axios.post(`${API_URL}/book`, {
        ...book,
        coverPhoto: imagePath,
        actualPdf: pdfPath,
      });

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
        isNew: false,
        isPopular: false,
      });
      setPdf(null);
      setImage(null);
      setPreview(null);
      setLoading(false);
      navigate("/books");
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Failed to add book");
    }
  };

  const discount = useMemo(() => {
    return book.mrp && book.price
      ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
      : 0;
  }, [book.mrp, book.price]);

  // ================= SHARED STYLES =================
  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-[#0e1a1c]/60 text-white placeholder:text-gray-500 border border-[#2c4449] focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 outline-none transition";

  const labelCls =
    "block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5";

  const sectionCls =
    "bg-[#1b2e31]/80 backdrop-blur rounded-2xl border border-[#2c4449] p-6 shadow-lg";

  const sectionTitle =
    "flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider mb-5 pb-3 border-b border-[#2c4449]";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a1416] via-[#0e1a1c] to-[#0a1416] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-[#1b2e31] border border-[#2c4449] text-gray-300 hover:text-amber-300 hover:border-amber-300/50 transition"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
                Add New Book
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Fill in the details to add a new book to your library
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300/10 border border-amber-300/30">
            <FaBook className="text-amber-300 text-sm" />
            <span className="text-amber-300 text-sm font-medium">
              New Entry
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* BASIC INFO */}
            <div className={sectionCls}>
              <h2 className={sectionTitle}>
                <FaBook /> Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Book Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={book.name}
                    onChange={handleChange}
                    placeholder="e.g. The Great Gatsby"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Author *</label>
                  <select
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select Author</option>
                    {authors.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    name="categories"
                    value={book.categories[0] || ""}
                    onChange={(e) =>
                      setBook({ ...book, categories: [e.target.value] })
                    }
                    className={inputCls}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    name="description"
                    value={book.description}
                    onChange={handleChange}
                    placeholder="A short description of the book..."
                    rows="4"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* PRICING */}
            <div className={sectionCls}>
              <h2 className={sectionTitle}>
                <FaRupeeSign /> Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Selling Price *</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                    <input
                      type="number"
                      name="price"
                      value={book.price}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>MRP *</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                    <input
                      type="number"
                      name="mrp"
                      value={book.mrp}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Stock</label>
                  <div className="relative">
                    <FaBoxOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                    <input
                      type="number"
                      name="stock"
                      value={book.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
              </div>

              {discount > 0 && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <FaTag className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">
                    Customers save {discount}% (₹{book.mrp - book.price})
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-5">
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0e1a1c]/60 border border-[#2c4449] cursor-pointer hover:border-amber-300/50 transition">
                  <input
                    type="checkbox"
                    checked={book.isNew}
                    onChange={(e) =>
                      setBook({ ...book, isNew: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-300"
                  />
                  <span className="text-sm text-gray-200 font-medium">
                    Mark as New
                  </span>
                </label>

                <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0e1a1c]/60 border border-[#2c4449] cursor-pointer hover:border-amber-300/50 transition">
                  <input
                    type="checkbox"
                    checked={book.isPopular}
                    onChange={(e) =>
                      setBook({ ...book, isPopular: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-300"
                  />
                  <span className="text-sm text-gray-200 font-medium">
                    Mark as Popular
                  </span>
                </label>
              </div>
            </div>

            {/* BOOK DETAILS */}
            <div className={sectionCls}>
              <h2 className={sectionTitle}>
                <FaCheckCircle /> Book Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    placeholder="978-..."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={book.pages}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={book.publisher}
                    onChange={handleChange}
                    placeholder="Publisher name"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={book.language}
                    onChange={handleChange}
                    placeholder="English"
                    className={inputCls}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelCls}>Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={book.dimensions}
                    onChange={(e) => handleDimensionChange(e.target.value)}
                    onBlur={handleDimensionBlur}
                    placeholder="e.g. 10 10 10 (auto-formats to cm)"
                    className={inputCls}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                    Book Type
                  </label>

                  <select
                    name="bookType"
                    value={book.bookType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#2b4a52] bg-[#132327] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  >
                    <option
                      value="physical"
                      className="bg-[#132327] text-white"
                    >
                      Physical Book
                    </option>

                    <option value="ebook" className="bg-[#132327] text-white">
                      E-Book
                    </option>

                    <option value="both" className="bg-[#132327] text-white">
                      Both (Physical + E-Book)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* FILE UPLOADS */}
            <div className={sectionCls}>
              <h2 className={sectionTitle}>
                <FaFilePdf /> Files & Media
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF */}
                <div>
                  <label className="block">
                    <div className="border-2 border-dashed border-[#2c4449] hover:border-amber-300 rounded-xl p-6 text-center cursor-pointer transition group bg-[#0e1a1c]/40">
                      <FaFilePdf className="mx-auto text-4xl text-gray-500 group-hover:text-amber-300 transition mb-3" />
                      <p className="text-sm font-semibold text-gray-200">
                        Upload Book PDF
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 20MB · PDF only
                      </p>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="hidden"
                      />
                    </div>
                  </label>

                  {pdf && (
                    <div className="mt-3 flex items-center justify-between bg-[#0e1a1c]/60 border border-[#2c4449] p-3 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <FaFilePdf className="text-amber-300 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-200 truncate font-medium">
                            {pdf.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {(pdf.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPdf(null)}
                        className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition flex-shrink-0"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block">
                    <div className="border-2 border-dashed border-[#2c4449] hover:border-amber-300 rounded-xl p-6 text-center cursor-pointer transition group bg-[#0e1a1c]/40">
                      <FaFileImage className="mx-auto text-4xl text-gray-500 group-hover:text-amber-300 transition mb-3" />
                      <p className="text-sm font-semibold text-gray-200">
                        Upload Cover Image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 5MB · JPG, PNG
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>

                  {image && (
                    <div className="mt-3 flex items-center justify-between bg-[#0e1a1c]/60 border border-[#2c4449] p-3 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <FaFileImage className="text-amber-300 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-200 truncate font-medium">
                            {image.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setImage(null);
                          setPreview(null);
                        }}
                        className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition flex-shrink-0"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 rounded-xl border border-[#2c4449] text-gray-300 hover:bg-[#1b2e31] transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 py-3.5 rounded-xl font-bold tracking-wide transition shadow-lg ${
                  loading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-amber-300 text-black hover:bg-amber-400 hover:shadow-amber-300/30 hover:shadow-2xl"
                }`}
              >
                {loading ? "Saving..." : "Publish Book"}
              </button>
            </div>
          </div>

          {/* RIGHT - LIVE PREVIEW */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-[#1b2e31] to-[#122125] rounded-2xl border border-[#2c4449] shadow-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2c4449] flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                    Live Preview
                  </h2>
                  <span className="text-[10px] text-gray-500">
                    Auto-updates
                  </span>
                </div>

                <div className="p-5">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0e1a1c] border border-[#2c4449] mb-4">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                        <FaFileImage className="text-5xl mb-2" />
                        <span className="text-xs">No cover image</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {book.isNew && (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-amber-300 text-black">
                          New
                        </span>
                      )}
                      {book.isPopular && (
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-pink-500 text-white">
                          Popular
                        </span>
                      )}
                    </div>

                    {discount > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded bg-green-500 text-white">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-[#dbf8fa] line-clamp-2">
                    {book.name || "Book Name"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {book.publisher || "Publisher"}
                  </p>

                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-2xl font-bold text-amber-300">
                      ₹{book.price || 0}
                    </span>
                    {book.mrp && book.price && book.mrp > book.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{book.mrp}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#2c4449]">
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">
                        Stock
                      </p>
                      <p className="text-sm text-gray-200 font-semibold">
                        {book.stock || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">
                        Pages
                      </p>
                      <p className="text-sm text-gray-200 font-semibold">
                        {book.pages || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">
                        Language
                      </p>
                      <p className="text-sm text-gray-200 font-semibold">
                        {book.language || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">
                        Size
                      </p>
                      <p className="text-sm text-gray-200 font-semibold">
                        {book.dimensions || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBooks;
