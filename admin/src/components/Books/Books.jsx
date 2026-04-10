import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const statusStyle = {
  Published: "bg-green-900/30 text-green-400",
  Draft: "bg-yellow-900/30 text-yellow-400",
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    author: "",
    category: "",
    price: "",
  });

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book");
      setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
    } catch (error) {
      console.error(error);
      setBooks([]);
    }
  };

  // ================= FETCH AUTHORS =================
  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(Array.isArray(res.data) ? res.data : res.data.authors || []);
    } catch (error) {
      console.error(error);
      setAuthors([]);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  // ================= SEARCH =================
  const filteredBooks = Array.isArray(books)
    ? books.filter((b) => b.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  // ================= DELETE =================
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/book/${id}`);
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= STATUS TOGGLE =================
  const toggleStatus = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b._id === id
          ? {
              ...b,
              status: b.status === "Published" ? "Draft" : "Published",
            }
          : b,
      ),
    );
  };

  // ================= DRAFT =================
  const moveToDraft = (id) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "Draft" } : b)),
    );
  };

  // ================= START EDIT =================
  const startEdit = (book) => {
    setEditBookId(book._id);

    setForm({
      name: book.name || "",
      author: book.author?.length > 0 ? book.author[0]._id : "",
      category: book.category || "",
      price: String(book.price || "").replace("₹", ""),
    });

    setShowModal(true);
  };

  // ================= UPDATE =================
  const updateBook = async () => {
    try {
      await axios.patch(`http://localhost:5000/book/${editBookId}`, {
        name: form.name,
        author: form.author,
        category: form.category,
        price: form.price,
      });

      fetchBooks();

      setShowModal(false);
      setEditBookId(null);

      setForm({
        name: "",
        author: "",
        category: "",
        price: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#0e1a1c] min-h-screen mt-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#dbf8fa] flex items-center gap-2">
          <MdOutlineLibraryBooks className="text-amber-300" />
          Books
        </h2>

        <Link
          to="/add-book"
          className="bg-amber-300 text-[#0e1a1c] px-4 py-2 rounded-lg font-semibold hover:bg-amber-400"
        >
          + Add Book
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Books</p>
          <h3 className="text-2xl font-bold text-[#dbf8fa]">{books.length}</h3>
        </div>

        <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Published</p>
          <h3 className="text-2xl font-bold text-green-400">
            {books.filter((b) => b.status === "Published").length}
          </h3>
        </div>

        <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-5">
          <p className="text-gray-400 text-sm">Draft</p>
          <h3 className="text-2xl font-bold text-yellow-400">
            {books.filter((b) => b.status === "Draft").length}
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#dbf8fa]">Book List</h3>

          <input
            type="text"
            placeholder="Search book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-400 border-b border-[#2c4449]">
              <th className="py-2">Book Name</th>
              <th className="py-2">Author</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#dbf8fa]">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="border-b border-[#2c4449]">
                <td className="py-2 flex items-center gap-3">
                  <img
                    src={`http://localhost:5000/${book.coverPhoto}`}
                    alt={book.name}
                    className="w-10 h-10 rounded object-cover border border-[#2c4449]"
                  />
                  <span>{book.name}</span>
                </td>

                <td className="text-gray-400">
                  {book.author?.length > 0 ? book.author[0].name : "N/A"}
                </td>

                <td>{book.category}</td>
                <td>{book.price}</td>

                <td>
                  <button
                    onClick={() => toggleStatus(book._id)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusStyle[book.status] || "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {book.status}
                  </button>
                </td>

                <td className="text-right">
                  <div className="flex justify-end gap-3">
                    <FiEye
                      className="text-amber-300 cursor-pointer"
                      onClick={() => moveToDraft(book._id)}
                    />

                    <FiEdit
                      className="text-blue-400 cursor-pointer"
                      onClick={() => startEdit(book)}
                    />

                    <FiTrash2
                      className="text-red-400 cursor-pointer"
                      onClick={() => deleteBook(book._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl w-[90%] max-w-md p-6">
            <h3 className="text-lg font-semibold text-[#dbf8fa] mb-4">
              Edit Book
            </h3>

            <input
              placeholder="Book Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[#122125] border border-[#2c4449] text-white"
            />

            <select
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[#122125] border border-[#2c4449] text-white"
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[#122125] border border-[#2c4449] text-white"
            />

            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[#122125] border border-[#2c4449] text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-[#2c4449] rounded-lg text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={updateBook}
                className="px-4 py-2 bg-amber-300 text-black rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
