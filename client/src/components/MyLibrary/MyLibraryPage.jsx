import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookOpen, Library } from "lucide-react";
import API_URL from "../../Constant";

const MyLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/book/my-library`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.books);
      console.log(res.data.books);
    } catch (err) {
      console.error("Failed to fetch library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1a1c] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-9 w-56 bg-[#162428] rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-40 bg-[#162428] rounded-lg animate-pulse mb-10" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#162428] rounded-2xl p-4 border border-[#1f3a3e]"
              >
                <div className="h-72 rounded-xl bg-[#20353a]" />
                <div className="h-4 bg-[#20353a] rounded mt-4" />
                <div className="h-4 bg-[#20353a] rounded w-1/2 mt-3" />
                <div className="h-10 bg-[#20353a] rounded-xl mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1a1c] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              My Library
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {books.length > 0
                ? `${books.length} ${books.length === 1 ? "book" : "books"} in your collection`
                : "Your personal ebook collection"}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#162428] border border-[#1f3a3e]">
            <Library className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-semibold">{books.length}</span>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-[#162428]/50 rounded-3xl border border-dashed border-[#1f3a3e]">
            <div className="w-16 h-16 rounded-2xl bg-[#1f3a3e] flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-emerald-500" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-200">
              No Ebooks Purchased
            </h2>

            <p className="text-gray-500 mt-2 max-w-sm">
              Purchase an ebook to see it here and start reading right away.
            </p>

            <Link to="/">
              <button className="mt-8 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors font-semibold text-white shadow-lg shadow-emerald-500/10 cursor-pointer">
                Browse Ebooks
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <div key={book._id} className="group">
                <div className="bg-[#122125] border border-white/5 hover:border-emerald-400/20 rounded-xl overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-0.5">
                  {/* Cover */}
                  <Link to={`/read/${book._id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={`${book.coverPhoto}`}
                        alt={book.name}
                        className="w-full h-44 sm:h-52 object-cover transition-transform duration-300"
                      />

                      {/* <div className="absolute top-2 left-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                          Ebook
                        </span>
                      </div> */}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="px-3 py-3 flex flex-col gap-2">
                    {/* Title + Price */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                        {book.name}
                      </h3>

                      <span className="text-xs font-bold text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        ₹{book.price}
                      </span>
                    </div>

                    {/* Author */}
                    <p className="text-xs text-gray-400 truncate">
                      by {book.author?.[0]?.name || "Unknown Author"}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1">
                      {book.categories?.length ? (
                        book.categories.slice(0, 2).map((cat, index) => (
                          <span
                            key={index}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b3338] text-emerald-400 border border-emerald-400/20"
                          >
                            {cat.name || cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500">
                          No Category
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <Link to={`/read/${book._id}`} className="mt-2">
                      <button className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all duration-300 cursor-pointer">
                        Read Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
