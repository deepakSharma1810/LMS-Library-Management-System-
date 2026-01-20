import React, { useEffect, useState } from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

// Status styles
const statusStyle = {
  Published: "bg-green-900/30 text-green-400",
  Draft: "bg-yellow-900/30 text-yellow-400",
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  // modal + form state
  const [showModal, setShowModal] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    author: "",
    category: "",
    price: "",
  });

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book");
      setBooks(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* SEARCH */
  const filteredBooks = books.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  /* DELETE */
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/book/${id}`);
      fetchBooks();
      // setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  /* TOGGLE STATUS (button click) */
  const toggleStatus = (id) => {
    setBooks(
      books.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "Published" ? "Draft" : "Published",
            }
          : b
      )
    );
  };

  /* EYE → FORCE DRAFT */
  const moveToDraft = (id) => {
    setBooks(books.map((b) => (b.id === id ? { ...b, status: "Draft" } : b)));
  };

  /* START EDIT */
  const startEdit = (book) => {
    setEditBookId(book._id);
    setForm({
      name: book.name,
      author: book.author,
      category: book.category,
      price: book.price.replace("₹", ""),
    });
    setShowModal(true);
  };

  /* SAVE EDIT */
  const updateBook = () => {
    setBooks(
      books.map((b) =>
        b.id === editBookId
          ? {
              ...b,
              ...form,
              price: `₹${form.price}`,
            }
          : b
      )
    );

    setShowModal(false);
    setEditBookId(null);
    setForm({ name: "", author: "", category: "", price: "" });
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
              <th className="py-2 text-[16px]">Book Name</th>
              <th className="py-2 text-[16px]">Author</th>
              <th className="py-2 text-[16px]">Category</th>
              <th className="py-2 text-[16px]">Price</th>
              <th className="py-2 text-[16px]">Status</th>
              <th className="py-2 text-[16px] text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-[#dbf8fa]">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="border-b border-[#2c4449]">
                <td className="py-2 flex items-center gap-3">
                  <img
                    src={`http://localhost:5000`}
                    alt={book.name}
                    className="w-10 h-10 rounded object-cover border border-[#2c4449]"
                  />
                  <span className="font-medium">{book.name}</span>
                </td>
                <td className="text-gray-400">
                  {book.author?.length > 0 ? book.author[0].name : "N/A"}
                </td>
                <td className="text-gray-400">{book.category}</td>
                <td>{book.price}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(book.id)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusStyle[book.status]
                    }`}
                  >
                    {book.status}
                  </button>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-3">
                    <FiEye
                      className="text-amber-300 cursor-pointer"
                      onClick={() => moveToDraft(book.id)}
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

            {["name", "author", "category", "price"].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-[#122125]
            border border-[#2c4449]
            text-[#dbf8fa]
            placeholder-gray-400
            outline-none
            focus:ring-2 focus:ring-amber-300
          "
              />
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="
            px-4 py-2 rounded-lg
            border border-[#2c4449]
            text-gray-400
            hover:bg-[#122125]
          "
              >
                Cancel
              </button>

              <button
                onClick={updateBook}
                className="
            px-4 py-2 rounded-lg
            bg-amber-300
            text-[#0e1a1c]
            font-semibold
            hover:bg-amber-400
          "
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
