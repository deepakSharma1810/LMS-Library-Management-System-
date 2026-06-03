import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";

const SkeletonCard = () => (
  <div className="bg-[#162428] rounded-2xl overflow-hidden animate-pulse border border-[#1f3a3e]">
    <div className="w-full h-52 bg-[#1f3338]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#1f3338] rounded-full w-3/4" />
      <div className="h-3 bg-[#1f3338] rounded-full w-1/2" />
      <div className="flex justify-between items-center mt-1">
        <div className="h-3 bg-[#1f3338] rounded-full w-1/3" />
        <div className="h-6 w-6 bg-[#1f3338] rounded-full" />
      </div>
    </div>
  </div>
);

const BookCard = ({ book }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/book/${book._id}`} className="group block">
      <div className="relative bg-[#162428] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_4px_20px_rgba(0,200,220,0.07)] transition-all duration-300 hover:-translate-y-1 border border-[#1f3a3e] hover:border-amber-300/20">
        <div className="relative w-full h-52 overflow-hidden bg-[#1f3338]">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
          )}

          <img
            src={`http://localhost:5000/${book.coverPhoto}`}
            alt={book.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#162428]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-[#e8f8fa] truncate leading-snug">
            {book.name}
          </p>

          <p className="text-xs text-amber-300 truncate">
            {book.author?.[0]?.name || "Unknown Author"}
          </p>

          {book.genre && (
            <span className="mt-1 self-start text-[10px] px-2 py-0.5 rounded-full bg-amber-300/10 text-amber-300 border border-amber-300/20 tracking-wide uppercase font-medium">
              {book.genre}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const BookPage = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axios.get(`http://localhost:5000/book`);
      setBooks(res.data);
    } catch (error) {
      console.log("Error fetch book", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const filtered = books?.books?.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
              All Books
            </h2>

            {!loading && books && (
              <p className="text-sm text-[#4a8a92] mt-1">
                {filtered?.length ?? 0} titles available
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-base" />

            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#162428] border border-[#1f3a3e] text-[#dbf8fa] placeholder-[#4a8a92] text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="col-span-full text-center py-20 text-[#4a8a92]">
            <p className="text-lg font-medium text-[#dbf8fa]">
              Something went wrong
            </p>

            <p className="text-sm mt-1 mb-4">Could not load books.</p>

            <button
              onClick={fetchBook}
              className="px-5 py-2 rounded-xl bg-amber-300/10 text-amber-300 border border-amber-300/20 text-sm hover:bg-amber-300/20 transition"
            >
              Retry
            </button>
          </div>
        ) : filtered?.length === 0 ? (
          <div className="col-span-full text-center py-20 text-[#4a8a92]">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-[#dbf8fa] font-medium">No books found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          filtered.map((book) => <BookCard key={book._id} book={book} />)
        )}
      </div>
    </div>
  );
};

export default BookPage;
