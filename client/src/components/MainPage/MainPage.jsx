import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdHeart } from "react-icons/io";
import { RiEqualizerFill } from "react-icons/ri";
import axios from "axios";
import { TbSend2 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const MainPage = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [addedBookId, setAddedBookId] = useState(null);

  const fetchbooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/book");
      setBooks(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching books:", error);
    }
  };

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
    fetchbooks();
    fetchAuthors();
  }, []);

  const addToCart = (book) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find((item) => item.id === book._id);

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === book._id ? { ...item, qty: item.qty + 1 } : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: book._id,
          image: `http://localhost:5000/${book.coverPhoto}`,
          title: book.name,
          author: book.author?.[0]?.name || "Unknown",
          price: book.price,
          originalPrice: book.price + 200,
          qty: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Book added to Cart");

    setAddedBookId(book._id);

    setTimeout(() => {
      setAddedBookId((prev) => (prev === book._id ? null : prev));
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-[70vh] relative overflow-hidden">
        <img
          src="./front_page_book3.png"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="w-full lg:w-1/2 h-full bg-gradient-to-r from-black/80 via-black/45 to-transparent backdrop-blur-[1px] flex items-center">
            {/* Content Container */}
            <div className="w-full max-w-2xl mx-auto px-6 sm:px-10 md:px-14">
              {/* Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 border border-amber-300/40 text-amber-300 px-2 py-1 rounded-full text-sm font-semibold">
                  📖 MYBOOKSTORE
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-5xl lg:text-3xl font-bold leading-tight text-white">
                Discover Your <br />
                <span className="text-amber-300">Next Great Read</span>
              </h1>

              {/* Sub Text */}
              <p className="text-gray-300  text-sm sm:text-base max-w-xl leading-7">
                Explore thousands of books, find inspiring authors, and build
                your perfect collection.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <p className="text-amber-300 text-xl mb-1">📚</p>
                  <h3 className="text-white font-semibold">
                    Thousands of Books
                  </h3>
                </div>

                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <p className="text-amber-300 text-xl mb-1">⭐</p>
                  <h3 className="text-white font-semibold">Top Authors</h3>
                </div>

                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <p className="text-amber-300 text-xl mb-1">⚡</p>
                  <h3 className="text-white font-semibold">Fast & Easy</h3>
                </div>
              </div>

              {/* Button */}
              <button className="mt-5 bg-amber-300 hover:bg-amber-400 text-black font-bold px-6 py-2 rounded-xl w-fit transition">
                Browse Books →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-6">
        {/* Left Section */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          {/* Previous Reading */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl sm:text-2xl font-bold text-[#dbf8fa]">
                Previous Reading
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-yellow-300">Filter</p>
                <RiEqualizerFill className="text-yellow-300 rotate-90" />
              </div>
            </div>
            <Slider {...settings}>
              {books &&
                books.books.map((book, i) => (
                  <div key={book._id} className="px-0 pb-3">
                    <div className="bg-[#122125] rounded-lg overflow-hidden shadow-xl/40 max-w-[280px] sm:max-w-[300px] md:max-w-[320px] mx-auto hover:scale-101 transition duration-200">
                      <Link to={`/book/${book._id}`} key={book._id}>
                        <div className="relative">
                          <img
                            src={`http://localhost:5000/${book.coverPhoto}`}
                            alt={book.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />

                          <div className="absolute top-2 right-2 bg-black/40 p-1 rounded-full">
                            <IoMdHeart className="text-sm text-gray-300 hover:text-red-500 cursor-pointer" />
                          </div>
                        </div>
                      </Link>

                      <div className="p-3 flex flex-col gap-1">
                        <Link to={`/book/${book._id}`} key={book._id}>
                          <div className="flex justify-between items-center gap-2 text-amber-50 hover:text-amber-300 duration-200">
                            <p className="text-sm font-semibold  line-clamp-2 ">
                              {book.name}
                            </p>
                            <span className="text-sm font-bold">
                              ₹{book.price}
                            </span>
                          </div>
                        </Link>

                        <p className="text-xs text-gray-400">
                          by {book.author?.[0]?.name || "Unknown"}
                        </p>

                        {/* 📂 Category (compact) */}
                        <div className="flex gap-1 overflow-hidden">
                          {book.category?.length > 0 ? (
                            book.category.slice(0, 2).map((cat, index) => (
                              <span
                                key={index}
                                className="text-[9px] px-2 py-[1px] bg-[#234046] text-amber-300 rounded-full truncate"
                              >
                                {cat.name || cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] text-gray-400">
                              No Category
                            </span>
                          )}
                        </div>

                        {/* ⭐ Bottom Row */}
                        <div className="flex justify-between items-center mt-1">
                          {/* 🛒 Add to Cart */}
                          <button
                            onClick={() => addToCart(book)}
                            className={`text-xs px-2 py-1 rounded font-semibold cursor-pointer ${
                              addedBookId === book._id
                                ? "bg-green-500 text-white"
                                : "bg-amber-300 text-black hover:bg-amber-400"
                            }`}
                          >
                            {addedBookId === book._id ? "Added" : "Add to cart"}
                          </button>

                          {/* ⭐ Rating */}
                          <div className="flex text-orange-400 text-xs">
                            ★★★★☆
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>

          {/* Subjects Section */}
          <div className="w-full">
            <p className="text-xl font-bold text-[#dbf8fa] mb-3">
              Subjects section
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Science",
                "Arts",
                "Commerce",
                "Design",
                "Cooking",
                "Others",
              ].map((subject, i) => (
                <div
                  key={subject}
                  className={`flex justify-between items-center px-4 py-2 rounded-xl ${
                    subject === "Cooking" ? "bg-amber-300" : "bg-[#234046]"
                  }`}
                >
                  <p
                    className={`text-lg font-bold ${
                      subject === "Cooking" ? "" : "text-amber-300"
                    }`}
                  >
                    {subject}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      subject === "Cooking" ? "" : "text-amber-300"
                    }`}
                  >
                    {["1.2k", "1.8k", "230", "80", "180", "900"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl font-bold text-[#dbf8fa]">New books</p>
              <p className="text-amber-300">Show all</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {books &&
                books?.books?.map((book) => (
                  <Link to={`/book/${book._id}`} key={book._id}>
                    <div className="min-w-[155px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[180px] flex-shrink-0 flex flex-col rounded-xl shadow-xl/40 hover:scale-101 transition duration-300">
                      <div className="w-full h-40">
                        <img
                          src={`http://localhost:5000/${book.coverPhoto}`}
                          alt={book.name}
                          className="w-full h-full object-cover border rounded-xl"
                        />
                      </div>
                      <div className="p-2">
                        <div className="flex justify-between ">
                          <p className="text-sm font-bold text-amber-50 truncate ">
                            {book.name}
                          </p>
                          <span className="text-sm font-bold text-white">
                            ₹{book.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-300">
                          <span>{book.author?.[0]?.name || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          {/* Popular Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-[18px]">
              <p className="text-xl font-bold text-[#dbf8fa]">Popular books</p>
              <p className="text-amber-300 text-sm">Show all</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {books &&
                books?.books?.slice(0, 6).map((book) => (
                  <Link to={`/book/${book._id}`} key={book._id}>
                    <div className="rounded-xl shadow-xl/40 hover:scale-101 transition duration-300 bg-[#122125] overflow-hidden">
                      <img
                        src={`http://localhost:5000/${book.coverPhoto}`}
                        alt=""
                        className="w-full h-32 object-cover rounded-xl border"
                      />
                      <div className="p-2">
                        <p className="text-sm font-bold text-amber-50 truncate">
                          {book.name}
                        </p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{book.author?.[0]?.name || "Unknown"}</span>
                          {/* <span className="text-yellow-300">{item.viewers}</span> */}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Writers and Authors */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl font-bold text-[#dbf8fa]">
                Writers and Authors
              </p>
              <p className="text-amber-300 text-sm">Show all</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authors &&
                authors?.slice(0, 6).map((author, i) => (
                  <Link to={`/author/${author._id}`} key={author._id}>
                    <div className="bg-[#122125] rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[160px] hover:scale-101 transition duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <img
                          src={`http://localhost:5000/${author.coverPhoto}`}
                          alt=""
                          className="w-12 h-12 rounded-full border border-amber-50"
                        />
                        <div className="text-right">
                          {/* <p className="text-xs text-amber-300">766</p> */}
                          <p className="text-xs text-gray-400">Books</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[#dbf8fa]">{author.name}</p>
                        <p className="text-xs text-gray-400">Writer & Author</p>
                        <div className="flex justify-between items-center text-amber-300 mt-1">
                          <p className="text-sm">More...</p>
                          <TbSend2 className="text-lg" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
