import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TbSend2 } from "react-icons/tb";
import {
  FaBookOpen,
  FaUsers,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import axios from "axios";

const authors = [
  {
    id: 1,
    name: "John Doe",
    role: "Writer & Author",
    books: 120,
    image: "https://example.com/favicons/user1.png",
    followers: 9500,
    bio: "John Doe is a bestselling novelist known for emotional storytelling and unique character depth.",
    topBooks: [
      "Silent Sunrise",
      "Hidden Truths",
      "Broken Memories",
      "Shades of Love",
    ],
    description:
      "John Doe has been writing for over 20 years, known for his powerful novels that explore human emotion and relationships. His writing style blends simplicity with deep meaning, making every book memorable.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Author",
    books: 95,
    image: "https://example.com/favicons/user2.png",
    followers: 7200,
    bio: "Jane Smith is a popular fiction author with multiple top-chart books.",
    topBooks: ["Storm of Hearts", "Dark Moon", "The Final Note"],
    description:
      "Jane Smith is a multi-award winning author who writes modern fiction blended with mystery and suspense. Her stories connect emotionally with readers worldwide.",
  },
  {
    id: 3,
    name: "Alex Johnson",
    role: "Novelist",
    books: 76,
    image: "https://example.com/favicons/user3.png",
    followers: 6400,
    bio: "Alex Johnson writes thrilling mystery novels.",
    topBooks: ["Last Breath", "Cold Streets", "Shadow Lines"],
    description:
      "Alex Johnson specializes in thrillers, crime novels, and dark mysteries. His storytelling keeps readers hooked till the last page.",
  },
];

const SingleAuthorPage = () => {
  const { id } = useParams();
  // const author = authors.find((a) => a.id === Number(id));
  const [author, setAuthor] = useState(null);

  const fetchSingleAuthor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/author/${id}`);
      setAuthor(res.data.author);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching Author:", error);
    }
  };

  useEffect(() => {
    fetchSingleAuthor();
  }, []);

  if (!author) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white">
        Author Not Found!
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-6 md:px-10 py-10 text-white">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/authors" className="hover:underline">
          Authors
        </Link>{" "}
        / <span className="text-amber-200 font-semibold">{author.name}</span>
      </p>

      <div className="max-w-5xl mx-auto bg-[#122125] rounded-xl p-6 shadow-xl">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Author Image */}
          <img
            src={`http://localhost:5000/${author.coverPhoto}`}
            alt={author.name}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-2 border-amber-200 shadow"
          />

          {/* Author Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa]">
              {author.name}
            </h1>
            <p className="text-sm text-gray-400">{author.role}</p>

            {/* Bio */}
            <p className="text-gray-300 mt-3">{author.bio}</p>

            {/* Stats */}
            <div className="flex gap-6 mt-5">
              <div className="flex items-center gap-2">
                <FaBookOpen className="text-amber-300 text-xl" />
                <p className="text-gray-200 text-sm font-medium">
                  {author.books} Books
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-300 text-xl" />
                <p className="text-gray-200 text-sm font-medium">
                  {/* {author.followers.toLocaleString()} Followers */}
                </p>
              </div>
            </div>

            {/* Social Icons */}
            {/* <div className="flex gap-4 mt-5">
              <FaFacebook className="text-blue-400 text-xl cursor-pointer hover:text-blue-500" />
              <FaTwitter className="text-sky-400 text-xl cursor-pointer hover:text-sky-500" />
              <FaInstagram className="text-pink-400 text-xl cursor-pointer hover:text-pink-500" />
            </div> */}

            {/* Message Button */}
            {/* <button className="mt-6 px-5 py-2 flex items-center gap-2 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition">
              <TbSend2 className="text-lg" />
              Message Author
            </button> */}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700"></div>

        {/* Top Books */}
        <h2 className="text-xl font-semibold text-[#dbf8fa] mb-4">
          Popular Books by {author.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* {author.topBooks.map((book, i) => (
            <div
              key={i}
              className="bg-[#0e1a1c] p-4 rounded-lg border border-gray-700"
            >
              <p className="text-amber-200 font-medium">{book}</p>
              <p className="text-xs text-gray-400 mt-1">By {author.name}</p>
            </div>
          ))} */}
        </div>

        {/* About / Description */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#dbf8fa] mb-3">
            About the Author
          </h2>
          <p className="text-gray-300 leading-relaxed">{author.description}</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-300 underline hover:text-white"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SingleAuthorPage;
