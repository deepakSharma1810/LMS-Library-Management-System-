import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdHeart } from "react-icons/io";
import { RiEqualizerFill } from "react-icons/ri";
import axios from "axios";
import { TbSend2 } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../Constant";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2, slidesToScroll: 1 },
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
};

const MainPage = () => {
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [previousBooks, setPreviousBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const [newRes, popularRes, prevRes] = await Promise.all([
        axios.get(`${API_URL}/book?type=new`),
        axios.get(`${API_URL}/book?type=popular`),
        axios.get(`${API_URL}/book?type=previous`),
      ]);
      setNewBooks(newRes.data.books);
      setPopularBooks(popularRes.data.books);
      setPreviousBooks(prevRes.data.books);
      console.log(newRes.data.books);
      // console.log(popularRes.data.books);
      // console.log(prevRes.data.books);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(`${API_URL}/author`);
      setAuthors(Array.isArray(res.data) ? res.data : res.data.authors || []);
    } catch (error) {
      console.log("Error fetching authors:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchAuthors()]);
      setLoading(false);
    };

    loadData();
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
          image: `${API_URL}/${book.coverPhoto}`,
          title: book.name,
          author: book.author?.[0]?.name || "Unknown",
          price: book.price,
          originalPrice: book.price + 200,
          qty: 1,
        },
      ];
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const PageSkeleton = () => {
    return (
      <div className="w-full min-h-screen bg-[#0d1c20] animate-pulse">
        {/* Hero Skeleton */}
        <div className="w-full h-[60vh] sm:h-[65vh] md:h-[60vh] lg:h-[70vh] bg-[#122125] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full md:w-[65%] lg:w-[50%] px-6 sm:px-10 md:px-12 lg:px-16">
              <div className="w-28 h-7 bg-white/10 rounded-full mb-5" />
              <div className="w-full h-12 bg-white/10 rounded mb-4" />
              <div className="w-3/4 h-12 bg-white/10 rounded mb-5" />
              <div className="w-[85%] h-4 bg-white/10 rounded mb-3 hidden sm:block" />
              <div className="w-[65%] h-4 bg-white/10 rounded mb-6 hidden sm:block" />

              <div className="flex flex-wrap gap-2 mb-6">
                <div className="w-36 h-8 bg-white/10 rounded-full" />
                <div className="w-28 h-8 bg-white/10 rounded-full" />
                <div className="w-24 h-8 bg-white/10 rounded-full" />
              </div>

              <div className="w-36 h-11 bg-amber-300/20 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8">
          {/* Left */}
          <div className="w-full lg:w-3/5 flex flex-col gap-10">
            {/* Previous Reading */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div className="w-48 h-7 bg-white/10 rounded" />
                <div className="w-20 h-7 bg-white/10 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#122125] border border-white/5 rounded-xl overflow-hidden"
                  >
                    <div className="w-full h-44 bg-white/10" />
                    <div className="p-3 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="flex gap-2">
                        <div className="h-5 bg-white/10 rounded-full w-16" />
                        <div className="h-5 bg-white/10 rounded-full w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Subjects */}
            <section>
              <div className="w-44 h-7 bg-white/10 rounded mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-[#1a2e34] border border-white/5 rounded-xl"
                  />
                ))}
              </div>
            </section>

            {/* New Books */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div className="w-32 h-7 bg-white/10 rounded" />
                <div className="w-24 h-7 bg-white/10 rounded-full" />
              </div>

              <div className="flex gap-3.5 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[140px] sm:min-w-[158px] lg:min-w-[138px] bg-[#122125] border border-white/5 rounded-xl overflow-hidden"
                  >
                    <div className="w-full h-[140px] bg-white/10" />
                    <div className="p-2 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="w-full lg:w-2/5 flex flex-col gap-9">
            {/* Popular Books */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div className="w-40 h-7 bg-white/10 rounded" />
                <div className="w-24 h-7 bg-white/10 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#122125] border border-white/5 rounded-xl overflow-hidden"
                  >
                    <div className="w-full h-28 bg-white/10" />
                    <div className="p-2.5 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Authors */}
            <section>
              <div className="flex justify-between items-center mb-5">
                <div className="w-52 h-7 bg-white/10 rounded" />
                <div className="w-24 h-7 bg-white/10 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#122125] border border-white/5 rounded-xl p-3.5 min-h-[148px]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-full bg-white/10" />
                      <div className="w-10 h-5 bg-white/10 rounded" />
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                      <div className="h-3 bg-white/10 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0d1c20]">
      {/* ── HERO ── */}
      <div className="w-full h-[60vh] sm:h-[65vh] md:h-[60vh] lg:h-[70vh] relative overflow-hidden">
        <img
          src="./front_page_book3.png"
          alt="Book Banner"
          className="w-full h-full object-cover"
        />
        {/* always-visible gradient so mobile also looks good */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="w-full md:w-[65%] lg:w-[50%] px-6 sm:px-10 md:px-12 lg:px-16">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 border border-amber-300/40 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide">
              MYBOOKSTORE
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-3">
              Discover Your{" "}
              <span className="text-amber-300 block sm:inline">
                Next Great Read
              </span>
            </h1>

            {/* Sub */}
            <p className="text-gray-300 text-sm sm:text-base max-w-md leading-relaxed mb-5 hidden sm:block">
              Explore thousands of books, find inspiring authors, and build your
              perfect collection.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: "", label: "Thousands of Books" },
                { icon: "", label: "Top Authors" },
                { icon: "", label: "Fast & Easy" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-full px-3 py-1.5"
                >
                  <span className="text-sm">{icon}</span>
                  <p className="text-white text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>

            <Link to="/books">
              <button className="bg-amber-300 hover:bg-amber-400 active:scale-95 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-amber-300/20 flex items-center gap-2 group cursor-pointer">
                Browse Books
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRightLong />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8">
        {/* ── LEFT ── */}
        <div className="w-full lg:w-3/5 flex flex-col gap-10">
          <div className="w-full px-4">
            <div className="flex justify-between items-center mb-5">
              <p className="text-xl sm:text-2xl font-bold text-[#dbf8fa]">
                Previous Reading
              </p>
            </div>

            <Slider {...settings}>
              {previousBooks.map((book) => (
                <div key={book._id} className="px-1.5 pb-3 ">
                  <div className=" bg-[#122125] border border-white/5 hover:border-amber-300/20 rounded-xl overflow-hidden shadow-lg  hover:shadow-amber-300/10 transition-all duration-300 group mx-auto">
                    <Link to={`/book/${book._id}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={`${API_URL}/${book.coverPhoto}`}
                          alt={book.name}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="px-3 py-2.5 flex flex-col gap-1.5">
                        <div className="flex justify-between items-start gap-2 text-amber-50">
                          <p className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors duration-200">
                            {book.name}
                          </p>
                          <span className="text-xs font-bold text-amber-300 whitespace-nowrap mt-0.5 bg-amber-300/10 px-2 py-0.5 rounded-full">
                            ₹{book.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          by {book.author?.[0]?.name || "Unknown"}
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {book.categories?.length > 0 ? (
                            book.categories.slice(0, 2).map((cat, index) => (
                              <span
                                key={index}
                                className="text-[9px] px-2 py-0.5 bg-[#1e3840] text-amber-300 rounded-full border border-amber-300/15"
                              >
                                {cat.name || cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] text-gray-500">
                              No Category
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Subjects Section */}
          <div className="w-full">
            <p className="text-xl font-bold text-[#dbf8fa] mb-5">
              Subjects section
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Science", count: "1.2k" },
                { name: "Arts", count: "1.8k" },
                { name: "Commerce", count: "230" },
                { name: "Design", count: "80" },
                { name: "Cooking", count: "180", highlight: true },
                { name: "Others", count: "900" },
              ].map(({ name, count, highlight }) => (
                <div
                  key={name}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    highlight
                      ? "bg-amber-300 hover:bg-amber-400 shadow-md shadow-amber-300/20"
                      : "bg-[#1a2e34] border border-white/5 hover:border-amber-300/30 hover:bg-[#1e3840]"
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${highlight ? "text-black" : "text-amber-300"}`}
                  >
                    {name}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      highlight
                        ? "bg-black/10 text-black"
                        : "bg-amber-300/10 text-amber-300"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* New Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-5">
              <p className="text-xl font-bold text-[#dbf8fa]">New books</p>
              <Link to="/books">
                <p className="text-amber-300 hover:text-amber-400 text-sm border border-amber-300/30 hover:border-amber-400/50 px-3 py-1 rounded-full transition-all duration-200 group flex gap-2 items-center">
                  Show all{" "}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <FaArrowRightLong />
                  </span>
                </p>
              </Link>
            </div>
            <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-hide">
              {newBooks?.map((book) => (
                <Link to={`/book/${book._id}`} key={book._id}>
                  <div className="min-w-[140px] sm:min-w-[158px] lg:min-w-[138px] flex-shrink-0 group hover:border-amber-300/20 rounded-xl hover:shadow-md hover:shadow-amber-300/8 transition-all duration-300 group cursor-pointer border border-white/5 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={`${API_URL}/${book.coverPhoto}`}
                        alt={book.name}
                        className="w-full h-[140px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-1 px-2">
                      <div className="flex justify-between items-center gap-1">
                        <p className="text-xs font-semibold text-amber-50 truncate group-hover:text-amber-300 transition-colors duration-200">
                          {book.name}
                        </p>
                        <span className="text-xs font-bold text-amber-300 whitespace-nowrap">
                          ₹{book.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {book.author?.[0]?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="w-full lg:w-2/5 flex flex-col gap-9">
          {/* Popular Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-5">
              <p className="text-xl font-bold text-[#dbf8fa]">Popular books</p>
              <Link to="/books">
                <p className="text-amber-300 hover:text-amber-400 text-sm flex gap-2 items-center border border-amber-300/30 hover:border-amber-400/50 px-3 py-1 rounded-full transition-all duration-200 group">
                  Show all{" "}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <FaArrowRightLong />
                  </span>
                </p>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {popularBooks?.slice(0, 6).map((book) => (
                <Link to={`/book/${book._id}`} key={book._id}>
                  <div className=" bg-[#122125] border border-white/5 hover:border-amber-300/20 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:shadow-amber-300/10 transition-all duration-300 group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={`${API_URL}/${book.coverPhoto}`}
                        alt={book.name}
                        className="w-full h-28 md:h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-amber-50 truncate group-hover:text-amber-300 transition-colors duration-200">
                        {book.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {book.author?.[0]?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Writers and Authors */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-5">
              <p className="text-xl font-bold text-[#dbf8fa]">
                Writers and Authors
              </p>
              <Link to="/authors">
                <p className="text-amber-300 hover:text-amber-400 text-sm border border-amber-300/30 hover:border-amber-400/50 px-3 py-1 rounded-full transition-all duration-200">
                  Show all →
                </p>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {authors?.slice(0, 6).map((author) => (
                <Link to={`/author/${author._id}`} key={author._id}>
                  <div className="bg-[#122125] border border-white/5 hover:border-amber-300/20 rounded-xl p-3.5 flex flex-col justify-between min-h-[148px] hover:-translate-y-1 hover:shadow-md hover:shadow-amber-300/8 transition-all duration-300 group cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="relative ">
                        <img
                          src={`${API_URL}/${author.coverPhoto}`}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-300/30 group-hover:border-amber-300/60 transition-colors duration-200"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-300">
                          {author.books.length}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                          Books
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-[#dbf8fa] truncate group-hover:text-amber-300 transition-colors duration-200">
                        {author.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Writer & Author
                      </p>
                      <div className="flex justify-between items-center text-amber-300 mt-2">
                        <p className="text-xs group-hover:underline">More...</p>
                        <TbSend2 className="text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
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
