import axios from "axios";
import React, { useEffect, useState } from "react";
import { TbSend2 } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";

const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/author");
      setAuthors(Array.isArray(res.data) ? res.data : res.data.authors || []);
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
        {authors &&
          authors.map((author, index) => (
            <Link to={`/author/${author._id}`} key={author._id}>
              <div
                key={author._id}
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
                      {author.books?.length || 0}
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
