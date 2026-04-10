import React, { useEffect, useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

const BookPage = () => {
  const [books, setBooks] = useState(null);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/book`);
      setBooks(res.data);
    } catch (error) {
      console.log("Error fetch book", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);
  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-6">
      <h2 className="text-2xl font-bold text-[#dbf8fa] mb-6 text-center">
        All Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books &&
          books.books.map((book, index) => (
            <Link to={`/book/${index + 1}`} key={index}>
              <div
                key={index}
                className="bg-[#1b2e31] rounded-xl overflow-hidden shadow-xl/40"
              >
                <img
                  src={`http://localhost:5000/${book.coverPhoto}`}
                  alt={book.name}
                  className="w-full h-40 object-cover rounded-t-xl border-b"
                />
                <div className="p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-amber-50 truncate">
                      {book.name}
                    </p>
                    <IoMdHeart className="text-lg text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <p>{book.author[0].name}</p>
                    {/* <p className="text-yellow-300">{item.viewers}</p> */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BookPage;
