// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { TbSend2 } from "react-icons/tb";
// import {
//   FaBookOpen,
//   FaUsers,
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
// } from "react-icons/fa";
// import axios from "axios";

// const authors = [
//   {
//     id: 1,
//     name: "John Doe",
//     role: "Writer & Author",
//     books: 120,
//     image: "https://example.com/favicons/user1.png",
//     followers: 9500,
//     bio: "John Doe is a bestselling novelist known for emotional storytelling and unique character depth.",
//     topBooks: [
//       "Silent Sunrise",
//       "Hidden Truths",
//       "Broken Memories",
//       "Shades of Love",
//     ],
//     description:
//       "John Doe has been writing for over 20 years, known for his powerful novels that explore human emotion and relationships. His writing style blends simplicity with deep meaning, making every book memorable.",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     role: "Author",
//     books: 95,
//     image: "https://example.com/favicons/user2.png",
//     followers: 7200,
//     bio: "Jane Smith is a popular fiction author with multiple top-chart books.",
//     topBooks: ["Storm of Hearts", "Dark Moon", "The Final Note"],
//     description:
//       "Jane Smith is a multi-award winning author who writes modern fiction blended with mystery and suspense. Her stories connect emotionally with readers worldwide.",
//   },
//   {
//     id: 3,
//     name: "Alex Johnson",
//     role: "Novelist",
//     books: 76,
//     image: "https://example.com/favicons/user3.png",
//     followers: 6400,
//     bio: "Alex Johnson writes thrilling mystery novels.",
//     topBooks: ["Last Breath", "Cold Streets", "Shadow Lines"],
//     description:
//       "Alex Johnson specializes in thrillers, crime novels, and dark mysteries. His storytelling keeps readers hooked till the last page.",
//   },
// ];

// const SingleAuthorPage = () => {
//   const { id } = useParams();
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchSingleAuthor = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/author/${id}`);
//       setAuthor(res.data.author);
//       console.log(res.data);
//     } catch (error) {
//       console.log("Error fetching Author:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSingleAuthor();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#071315] flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-300">Loading book details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!author) {
//     return (
//       <div className="w-full h-screen flex justify-center items-center text-white">
//         Author Not Found!
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-[#0e1a1c] px-6 md:px-10 py-10 text-white">
//       {/* Breadcrumb */}
//       <p className="text-sm text-gray-400 mb-4">
//         <Link to="/" className="hover:underline">
//           Home
//         </Link>{" "}
//         /{" "}
//         <Link to="/authors" className="hover:underline">
//           Authors
//         </Link>{" "}
//         / <span className="text-amber-200 font-semibold">{author.name}</span>
//       </p>

//       <div className="max-w-5xl mx-auto bg-[#122125] rounded-xl p-6 shadow-xl">
//         {/* Top Section */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Author Image */}
//           <img
//             src={`http://localhost:5000/${author.coverPhoto}`}
//             alt={author.name}
//             className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-2 border-amber-200 shadow"
//           />

//           {/* Author Info */}
//           <div className="flex-1">
//             <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa]">
//               {author.name}
//             </h1>
//             <p className="text-sm text-gray-400">{author.role}</p>

//             {/* Bio */}
//             <p className="text-gray-300 mt-3">{author.bio}</p>

//             {/* Stats */}
//             <div className="flex gap-6 mt-5">
//               <div className="flex items-center gap-2">
//                 <FaBookOpen className="text-amber-300 text-xl" />
//                 <p className="text-gray-200 text-sm font-medium">
//                   {Array.isArray(author.books)
//                     ? author.books.length
//                     : author.books || 0}{" "}
//                   Books
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <FaUsers className="text-blue-300 text-xl" />
//                 <p className="text-gray-200 text-sm font-medium">
//                   {/* {author.followers.toLocaleString()} Followers */}
//                 </p>
//               </div>
//             </div>

//             {/* Social Icons */}
//             {/* <div className="flex gap-4 mt-5">
//               <FaFacebook className="text-blue-400 text-xl cursor-pointer hover:text-blue-500" />
//               <FaTwitter className="text-sky-400 text-xl cursor-pointer hover:text-sky-500" />
//               <FaInstagram className="text-pink-400 text-xl cursor-pointer hover:text-pink-500" />
//             </div> */}

//             {/* Message Button */}
//             {/* <button className="mt-6 px-5 py-2 flex items-center gap-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition">
//               <TbSend2 className="text-lg" />
//               Message Author
//             </button> */}
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="my-8 border-t border-gray-700"></div>

//         {/* Top Books */}
//         <h2 className="text-xl font-semibold text-[#dbf8fa] mb-4">
//           Popular Books by {author.name}
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {author.topBooks?.map((book, i) => (
//             <div
//               key={book._id || i}
//               className="bg-[#0e1a1c] p-4 rounded-lg border border-gray-700"
//             >
//               <p className="text-amber-200 font-medium">
//                 {typeof book === "string" ? book : book.name}
//               </p>
//               <p className="text-xs text-gray-400 mt-1">By {author.name}</p>
//             </div>
//           ))}
//         </div>

//         {/* About / Description */}
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold text-[#dbf8fa] mb-3">
//             About the Author
//           </h2>
//           <p className="text-gray-300 leading-relaxed">{author.description}</p>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="text-center mt-8">
//         <button
//           onClick={() => window.history.back()}
//           className="text-sm text-gray-300 underline hover:text-white"
//         >
//           Go Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SingleAuthorPage;

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
      const res = await axios.get(`http://localhost:5000/author/${id}`);
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
                      src={`http://localhost:5000/${author.coverPhoto}`}
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
