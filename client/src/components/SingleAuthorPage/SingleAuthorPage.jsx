import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TbSend2 } from "react-icons/tb";
import {
  FaBookOpen,
  FaUsers,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";

// ─── SKELETON ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10">
    <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-48 bg-[#1f3338] rounded-full" />
      <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-36 h-36 rounded-full bg-[#1f3338] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-3 py-2">
            <div className="h-7 w-1/2 bg-[#1f3338] rounded-full" />
            <div className="h-4 w-1/4 bg-[#1f3338] rounded-full" />
            <div className="h-4 w-full bg-[#1f3338] rounded-full mt-2" />
            <div className="h-4 w-5/6 bg-[#1f3338] rounded-full" />
            <div className="flex gap-4 mt-2">
              <div className="h-8 w-24 bg-[#1f3338] rounded-xl" />
              <div className="h-8 w-24 bg-[#1f3338] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-[#162428] rounded-2xl border border-[#1f3a3e]"
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const SingleAuthorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchSingleAuthor = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://lms-library-management-system-9nhw.onrender.com/author/${id}`,
      );
      setAuthor(res.data.author);
    } catch (error) {
      console.log("Error fetching Author:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleAuthor();
  }, [id]);

  if (loading) return <Skeleton />;

  if (!author)
    return (
      <div className="min-h-screen bg-[#0e1a1c] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-[#dbf8fa]">Author not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-[#162428] border border-[#1f3a3e] text-[#4a8a92] text-sm hover:text-[#2dd4e0] transition"
        >
          Go Back
        </button>
      </div>
    );

  const bookCount = Array.isArray(author.books)
    ? author.books.length
    : author.books || 0;

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#4a8a92] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#2dd4e0] transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/authors" className="hover:text-[#2dd4e0] transition">
            Authors
          </Link>
          <span>/</span>
          <span className="text-[#dbf8fa] font-semibold">{author.name}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-7">
            {/* Avatar */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-[#2dd4e0]/30 bg-[#1f3338]">
                {!imgError ? (
                  <>
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
                    )}
                    <img
                      src={`https://lms-library-management-system-9nhw.onrender.com/${author.coverPhoto}`}
                      alt={author.name}
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgError(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#2dd4e0]">
                    {author.name?.[0] || "A"}
                  </div>
                )}
              </div>

              {/* Social Icons */}
              <div className="flex gap-3">
                {author.social?.facebook && (
                  <a
                    href={author.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 hover:bg-blue-400/20 transition"
                  >
                    <FaFacebook className="text-sm" />
                  </a>
                )}
                {author.social?.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 hover:bg-sky-400/20 transition"
                  >
                    <FaTwitter className="text-sm" />
                  </a>
                )}
                {author.social?.instagram && (
                  <a
                    href={author.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center text-pink-400 hover:bg-pink-400/20 transition"
                  >
                    <FaInstagram className="text-sm" />
                  </a>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] leading-tight">
                  {author.name}
                </h1>
                {author.role && (
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#2dd4e0]/10 border border-[#2dd4e0]/20 text-[#2dd4e0] uppercase tracking-wide font-medium">
                    {author.role}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#6bbcc4] leading-relaxed">
                {author.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-3 flex-wrap mt-1">
                <div className="flex items-center gap-2 bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl px-3 py-2">
                  <FaBookOpen className="text-amber-400 text-sm" />
                  <p className="text-sm font-semibold text-[#dbf8fa]">
                    {bookCount}
                  </p>
                  <p className="text-xs text-[#4a8a92]">Books</p>
                </div>
                {author.followers && (
                  <div className="flex items-center gap-2 bg-[#0e1a1c] border border-[#1f3a3e] rounded-xl px-3 py-2">
                    <FaUsers className="text-[#2dd4e0] text-sm" />
                    <p className="text-sm font-semibold text-[#dbf8fa]">
                      {Number(author.followers).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#4a8a92]">Followers</p>
                  </div>
                )}
              </div>

              {/* Message Button */}
              <button className="self-start mt-2 px-5 py-2 flex items-center gap-2 bg-amber-400 text-black font-semibold text-sm rounded-xl hover:bg-amber-500 transition">
                <TbSend2 /> Message Author
              </button>
            </div>
          </div>
        </div>

        {/* Popular Books */}
        {author.topBooks?.length > 0 && (
          <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
            <h2 className="text-base font-semibold text-[#dbf8fa] mb-4">
              Popular Books
              <span className="text-[#4a8a92] font-normal text-sm ml-2">
                by {author.name}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {author.topBooks.map((book, i) => (
                <Link
                  key={book._id || i}
                  to={book._id ? `/book/${book._id}` : "#"}
                  className="group bg-[#0e1a1c] border border-[#1f3a3e] hover:border-[#2dd4e0]/30 rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,200,220,0.07)]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#dbf8fa] group-hover:text-[#2dd4e0] transition">
                      {typeof book === "string" ? book : book.name}
                    </p>
                    <p className="text-xs text-[#4a8a92] mt-0.5">
                      by {author.name}
                    </p>
                  </div>
                  <TbSend2 className="text-[#2a5a62] group-hover:text-[#2dd4e0] transition text-lg flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        {author.description && (
          <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
            <h2 className="text-base font-semibold text-[#dbf8fa] mb-3">
              About the Author
            </h2>
            <p className="text-sm text-[#6bbcc4] leading-relaxed">
              {author.description}
            </p>
          </div>
        )}

        {/* Back */}
        <div className="flex justify-start pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#4a8a92] hover:text-[#2dd4e0] transition"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleAuthorPage;
