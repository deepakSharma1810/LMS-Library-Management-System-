import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbSend2 } from "react-icons/tb";
import { Link } from "react-router-dom";

const authors = [
  {
    name: "John Doe",
    role: "Writer & Author",
    books: 120,
    image: "https://example.com/favicons/user1.png",
  },
  {
    name: "Jane Smith",
    role: "Author",
    books: 95,
    image: "https://example.com/favicons/user2.png",
  },
  {
    name: "Alex Johnson",
    role: "Novelist",
    books: 76,
    image: "https://example.com/favicons/user3.png",
  },
  {
    name: "Maria Lee",
    role: "Poet",
    books: 134,
    image: "https://example.com/favicons/user4.png",
  },
  {
    name: "Daniel Green",
    role: "Writer",
    books: 52,
    image: "https://example.com/favicons/user5.png",
  },
  {
    name: "Ava Turner",
    role: "Editor & Author",
    books: 88,
    image: "https://example.com/favicons/user6.png",
  },
];

const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching authors:", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);
  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-6">
      <h2 className="text-2xl font-bold text-[#dbf8fa] mb-6 text-center">
        All Authors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {authors.map((author, index) => (
          <Link to={`/author/${index + 1}`} key={index}>
            <div
              key={index}
              className="bg-[#122125] rounded-xl p-4 flex flex-col justify-between shadow-xl/40"
            >
              <div className="flex justify-between items-center mb-4">
                <img
                  src={`http://localhost:5000/${author.coverPhoto}`}
                  alt={author.name}
                  className="w-14 h-14 rounded-full border border-amber-50 object-cover"
                />
                <div className="text-right">
                  <p className="text-sm text-amber-300">
                    {author.books.length}
                  </p>
                  <p className="text-xs text-gray-400">Books</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#dbf8fa] font-semibold">
                  {author.name}
                </p>
                <p className="text-xs text-gray-400">{author.role}</p>
                <div className="flex justify-between items-center text-amber-300 mt-2">
                  <p className="text-sm font-medium">More...</p>
                  <TbSend2 className="text-lg" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuthorPage;
