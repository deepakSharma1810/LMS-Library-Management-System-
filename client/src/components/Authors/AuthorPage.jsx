import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbSend2 } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import API_URL from "../../Constant";

const SkeletonCard = () => (
  <div className="bg-[#162428] rounded-2xl p-5 flex flex-col gap-4 animate-pulse border border-[#1f3a3e]">
    <div className="flex justify-between items-center">
      <div className="w-14 h-14 rounded-full bg-[#1f3338]" />
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-8 bg-[#1f3338] rounded-full" />
        <div className="h-3 w-12 bg-[#1f3338] rounded-full" />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <div className="h-4 w-2/3 bg-[#1f3338] rounded-full" />
      <div className="h-3 w-1/3 bg-[#1f3338] rounded-full" />
    </div>
  </div>
);

const AuthorCard = ({ author }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/author/${author._id}`} className="group block">
      <div className="relative bg-[#162428] rounded-2xl p-5 flex flex-col justify-between gap-4 border border-[#1f3a3e] hover:border-amber-300/20 shadow-lg hover:shadow-[0_4px_20px_rgba(0,200,220,0.07)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

        <div className="flex justify-between items-center">
          <div className="relative w-14 h-14 rounded-full">
            {!imgLoaded && (
              <div className="absolute inset-0 rounded-full bg-[#1f3338] animate-pulse" />
            )}

            <img
              src={`${author.coverPhoto}`}
              alt={author.name}
              onLoad={() => setImgLoaded(true)}
              className={`w-14 h-14 rounded-full object-cover ring-2 ring-amber-300/30 group-hover:ring-amber-300/60 transition-all duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <div className="flex flex-col items-center bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl px-3 py-1.5">
            <p className="text-base font-bold text-amber-300 leading-none">
              {author.books?.length || 0}
            </p>

            <p className="text-[10px] text-[#4a8a92] mt-0.5 uppercase tracking-wider">
              Books
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#e8f8fa] truncate">
            {author.name}
          </p>

          {author.role && (
            <span className="self-start text-[10px] px-2 py-0.5 rounded-full bg-amber-300/10 text-amber-300 border border-amber-300/20 tracking-wide uppercase font-medium">
              {author.role}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-[#1f3a3e]">
          <p className="text-xs text-[#4a8a92] group-hover:text-amber-300 transition-colors duration-200 font-medium">
            View Profile
          </p>

          <div className="p-1.5 rounded-full bg-amber-300/10 group-hover:bg-amber-300/20 transition-colors duration-200">
            <TbSend2 className="text-sm text-amber-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await axios.get(`${API_URL}/author`);

      setAuthors(Array.isArray(res.data) ? res.data : res.data.authors || []);
    } catch (error) {
      console.log("Error fetching authors:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filtered = authors.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10">
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
              All Authors
            </h2>

            {!loading && (
              <p className="text-sm text-[#4a8a92] mt-1">
                {filtered.length} authors found
              </p>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a8a92] text-base" />

            <input
              type="text"
              placeholder="Search authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#162428] border border-[#1f3a3e] text-[#dbf8fa] placeholder-[#4a8a92] text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-amber-300/40 focus:ring-1 focus:ring-amber-300/20 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="col-span-full text-center py-20 text-[#4a8a92]">
            <p className="text-lg font-medium text-[#dbf8fa]">
              Something went wrong
            </p>

            <p className="text-sm mt-1 mb-4">Could not load authors.</p>

            <button
              onClick={fetchAuthors}
              className="px-5 py-2 rounded-xl bg-amber-300/10 text-amber-300 border border-amber-300/20 text-sm hover:bg-amber-300/20 transition"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 text-[#4a8a92]">
            <p className="text-[#dbf8fa] font-medium">No authors found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          filtered.map((author) => (
            <AuthorCard key={author._id} author={author} />
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
