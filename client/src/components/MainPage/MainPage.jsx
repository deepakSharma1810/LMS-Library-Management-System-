import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdHeart } from "react-icons/io";
import { RiEqualizerFill } from "react-icons/ri";
import axios from "axios";
import { TbSend2 } from "react-icons/tb";
import { Link } from "react-router-dom";

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
      setAuthors(res.data);
      // console.log(res.data);
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
          author: book.author[0]?.name || "Unknown",
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
      setAddedBookId(null);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-[50vh]">
        <img src="" alt="" className="w-full h-full object-cover" />
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
                    <div className="bg-[#122125] rounded-lg overflow-hidden shadow-xl/40 max-w-xs mx-auto hover:scale-101 transition duration-200">
                      <Link to={`/book/${book._id}`} key={i}>
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
                        <Link to={`/book/${book._id}`} key={i}>
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
                          by {book.author[0]?.name || "Unknown"}
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
                        <div
                          onClick={() => addToCart(book)}
                          className="flex justify-between items-center mt-1"
                        >
                          {/* 🛒 Add to Cart */}
                          <button className="text-xs bg-amber-300 text-black px-2 py-1 hover:bg-amber-400 rounded font-semibold">
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
                books.books.map((book, i) => (
                  <Link to={`/book/${book._id}`} key={i}>
                    <div
                      key={book._id}
                      className="min-w-[150px] flex-shrink-0 flex flex-col rounded-xl shadow-xl/40 hover:scale-101 transition duration-300"
                    >
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
                          <span>{book.author[0].name}</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {books &&
                books.books.map((book, i) => (
                  <Link to={`/book/${book._id}`} key={i}>
                    <div
                      key={i}
                      className="rounded-lg shadow-xl/40 hover:scale-101 transition duration-300"
                    >
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
                          <span>{book.author[0].name}</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {authors &&
                authors.map((author, i) => (
                  <Link to={`/author/${i + 1}`} key={i}>
                    <div
                      key={i}
                      className="bg-[#122125] rounded-xl p-3 flex flex-col justify-between"
                    >
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
