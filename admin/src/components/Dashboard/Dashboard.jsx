import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import {
  MdOutlineLibraryBooks,
  MdPublishedWithChanges,
  MdDrafts,
  MdCurrencyRupee,
  MdWarningAmber,
} from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import axios from "axios";

// Dummy Project Data
const initialBooks = [
  {
    id: 1,
    name: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    price: "₹499",
    status: "Published",
  },
  {
    id: 2,
    name: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    price: "₹399",
    status: "Draft",
  },
  {
    id: 3,
    name: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Motivation",
    price: "₹299",
    status: "Published",
  },
];

// Status style
const statusStyle = {
  Published: "bg-green-900/30 text-green-400",
  Draft: "bg-yellow-900/30 text-yellow-400",
};

const Dashboard = () => {
  // const [books] = useState(initialBooks);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // ================= FETCH DATA =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book");
      setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setBooks([]);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(Array.isArray(res.data) ? res.data : res.data.authors || []);
    } catch (error) {
      console.error(error);
      setAuthors([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      setCategories(res.data.categories || []);
      console.log(res.data.categories);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  // dummy users
  // const fetchUsers = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/user");
  //     setUsers(res.data.users || []);
  //   } catch (error) {
  //     console.error(error);
  //     setUsers([]);
  //   }
  // };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchCategories();
    // fetchUsers();
  }, []);

  const totalSales = books.reduce(
    (sum, book) => sum + Number(book.price || 0),
    0,
  );

  const publishedBooks = books.filter(
    (book) => book.status === "Published",
  ).length;

  const stats = [
    {
      label: "Users",
      // value: users.length,
      icon: <FiUsers className="text-xl text-amber-300" />,
      change: "6.4%",
      up: true,
    },
    {
      label: "Authors",
      value: authors.length,
      icon: <FaUserEdit className="text-xl text-amber-300" />,
      change: "2.1%",
      up: true,
    },
    {
      label: "Books",
      value: books.length,
      icon: <MdOutlineLibraryBooks className="text-xl text-amber-300" />,
      change: "3.9%",
      up: false,
    },
    {
      label: "Categories",
      value: categories.length,
      icon: <BiCategory className="text-xl text-amber-300" />,
      change: "1.8%",
      up: true,
    },
    {
      label: "Published",
      value: publishedBooks,
      icon: <MdPublishedWithChanges className="text-xl text-green-400" />,
      change: "5.1%",
      up: true,
    },
    {
      label: "Total Sales",
      value: `₹${totalSales}`,
      icon: <MdCurrencyRupee className="text-xl text-amber-300" />,
      change: "8.9%",
      up: true,
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#0e1a1c] min-h-screen mt-20">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1b2e31] rounded-xl px-6 py-5 border border-[#2c4449]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#122125] rounded-lg">{item.icon}</div>
                <div>
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <h4 className="text-2xl font-bold text-[#dbf8fa]">
                    {item.value}
                  </h4>
                </div>
              </div>

              <div
                className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  item.up
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {item.up ? (
                  <FaArrowUp className="mr-1 text-sm" />
                ) : (
                  <FaArrowDown className="mr-1 text-sm" />
                )}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT BOOKS */}
      <div className="bg-[#1b2e31] p-6 rounded-2xl border border-[#2c4449]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#dbf8fa]">Recent Books</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-[#2c4449]">
                <th className="py-2">Book Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="text-[#dbf8fa]">
              {books.slice(0, 5).map((book) => (
                <tr
                  key={book._id}
                  className="border-b border-[#2c4449] last:border-none"
                >
                  <td className="py-4 font-medium">{book.name}</td>
                  <td className="text-gray-400">
                    {book.author?.[0]?.name || "N/A"}
                  </td>
                  <td className="text-gray-400">
                    {book.categories
                      ?.map(
                        (id) => categories.find((cat) => cat._id === id)?.name,
                      )
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </td>
                  <td>{book.price}</td>
                  <td>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusStyle[book.status]
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}

              {books.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No books available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
