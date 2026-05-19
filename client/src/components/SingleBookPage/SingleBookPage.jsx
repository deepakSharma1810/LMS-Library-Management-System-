import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { FaStar, FaShippingFast, FaBook } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import axios from "axios";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );

const Stars = ({ value }) => {
  // show 5 stars with filled portion
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <FaStar key={i} />;
        if (i === full && half)
          return <FaStar key={i} style={{ opacity: 0.6 }} />;
        return <FaStar key={i} style={{ opacity: 0.2 }} />;
      })}
    </div>
  );
};

const SingleBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [CartBtnText, setCartBtnText] = useState("Add to Cart");
  const [readMsg, setReadMsg] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingsList, setRatingsList] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchSingleBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/book/${id}`);
      setBook(res.data.getBook);
      console.log(res.data.getBook);
    } catch (error) {
      console.log("Error fetching book:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBook();
  }, [id]);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/rating/${book._id}`);
      setRatingsList(res.data.ratings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (book?._id) fetchRatings();
  }, [book]);

  const submitRating = async () => {
    try {
      await axios.post("http://localhost:5000/rating/add", {
        rating: userRating,
        review: reviewText,
        bookId: book._id,
        userId: localStorage.getItem("userId"),
      });

      fetchRatings();
      setUserRating(0);
      setReviewText("");
    } catch (err) {
      console.log(err);
    }
  };

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (!book) return;

    const wiishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exist = wiishlist.find((item) => item._id === book?._id);

    setIsWishlisted(!!exist);
  }, [book]);

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exist = wishlist.find((item) => item._id === book._id);

    let updatedWishlist;

    if (exist) {
      // Remove
      updatedWishlist = wishlist.filter((item) => item._id !== book._id);
      setIsWishlisted(false);
    } else {
      // Add
      updatedWishlist = [...wishlist, book];
      setIsWishlisted(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleBuyBook = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const purchased = JSON.parse(localStorage.getItem("purchasedBooks")) || [];

    const alreadyBought = purchased.find((item) => item._id === book._id);

    if (!alreadyBought) {
      const updated = [...purchased, book];
      localStorage.setItem("purchasedBooks", JSON.stringify(updated));
    }

    // navigate(`/read/${book._id}`);
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const alreadyExist = existingCart.find((item) => item._id === book._id);

    let updatedCart;

    if (alreadyExist) {
      updatedCart = existingCart.map((item) =>
        item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
      );
    } else {
      updatedCart = [...existingCart, { ...book, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // navigate("/cart");

    setCartBtnText("Added to Cart");

    setTimeout(() => {
      setCartBtnText("Add to Cart");
    }, 1000);
  };

  const handleOnlinePurchase = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const purchased = JSON.parse(localStorage.getItem("purchasedBooks")) || [];

    const alreadyBought = purchased.find((item) => item._id === book._id);

    if (!alreadyBought) {
      const updated = [...purchased, { ...book, type: "online" }];
      localStorage.setItem("purchasedBooks", JSON.stringify(updated));
    }

    navigate(`/read/${book._id}`);
  };

  const handlePhysicalPurchase = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = [...orders, { ...book, type: "physical" }];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert("Order placed successfully ");
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/rating/${id}`);
      fetchRatings();
    } catch (err) {
      console.log(err);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-blue-600 rounded text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto gap-8">
        {/* LEFT: Image + thumbnails (md: col-span-2) */}
        <div className="md:col-span-2">
          <nav className="text-sm text-gray-400 mb-4">
            <Link to="/" className="text-gray-300 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/books" className="text-gray-300 hover:underline">
              <span>Books</span>
            </Link>{" "}
            / <span className="text-amber-200 font-semibold">{book.name}</span>
          </nav>

          <div className="bg-[#1b2e31] rounded-lg p-5 shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex items-start justify-center">
                <img
                  src={`http://localhost:5000/${book.coverPhoto}`}
                  alt={book.imageName}
                  className="w-full md:w-5/6 h-full object-cover rounded-lg border"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] mb-2">
                  {book.name}
                </h1>

                <div className="flex items-center gap-8 mb-3">
                  <div className="flex items-center gap-2">
                    {/* <img
                      src={book.favicon}
                      alt="author"
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <p className="text-sm">
                        {book.author?.length > 0 ? book.author[0].name : "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Stars value={book.rating} />
                    <span className="text-sm text-gray-300">
                      {book.rating} • {book.reviews} reviews
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Price:</div>
                      <div className="flex items-baseline gap-3">
                        <div className="text-2xl font-bold text-amber-50">
                          {formatCurrency(book.price)}
                        </div>
                        <div className="text-sm line-through text-gray-500">
                          {formatCurrency(book.mrp)}
                        </div>
                        <div className="text-sm text-green-400">
                          ({book.discountPercent}% OFF)
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Inclusive of all taxes
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FaShippingFast />
                    <div>
                      <div>{book.deliveryEstimate}</div>
                      <div className="text-xs text-gray-500">
                        Free delivery above ₹499
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-700 text-sm text-gray-300">
                    <div className="mb-2">
                      <span className="text-gray-400">Sold by:</span>{" "}
                      <span className="text-amber-200">
                        {book.seller?.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Seller rating: {book.seller?.rating}/5
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{book.description}</p>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-400 mb-2">
                    Product details
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>ISBN: {book.isbn}</li>
                    <li>Publisher: {book.publisher}</li>
                    <li>Pages: {book.pages}</li>
                    <li>Language: {book.language}</li>
                    <li>Dimensions: {book.dimensions}</li>
                  </ul>
                </div>

                {/* <div className="mb-3">
                  <h4 className="text-sm text-gray-400 mb-2">Key features</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.features.map((f, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#0f2a2c] px-3 py-1 rounded-full text-gray-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div> */}

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="px-4 py-2 bg-amber-400 text-black font-semibold rounded shadow hover:bg-amber-500 transition cursor-pointer"
                  >
                    Buy Now
                  </button>

                  <Link to={`/read/${id}`}>
                    <button
                      // onClick={handleReadBook}
                      className="px-4 py-2 bg-green-500 text-black font-semibold rounded hover:bg-green-600 transition cursor-pointer"
                    >
                      Read Book
                    </button>
                  </Link>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-transparent border border-gray-600 rounded text-gray-300 hover:bg-gray-800 cursor-pointer"
                  >
                    {CartBtnText}
                  </button>

                  <button
                    onClick={handleWishlist}
                    className="ml-auto flex items-center gap-2 text-gray-300 cursor-pointer"
                  >
                    <IoMdHeart
                      className={`text-2xl transition ${
                        isWishlisted ? "text-red-500" : "hover:text-red-400"
                      }`}
                    />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </button>
                </div>

                {showPurchaseModal && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-[#0f1f23] border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
                      {/* Header */}
                      <h2 className="text-2xl font-bold text-center text-[#dbf8fa] mb-1">
                        Choose Your Format
                      </h2>
                      <p className="text-center text-gray-400 text-sm mb-6">
                        Select how you want to enjoy this book
                      </p>

                      {/* Options */}
                      <div className="grid gap-4">
                        {/* 📖 Online Book */}
                        <div
                          onClick={() => {
                            handleOnlinePurchase();
                            setShowPurchaseModal(false);
                          }}
                          className="cursor-pointer border border-gray-700 hover:border-green-400 bg-[#122a2f] hover:bg-[#16383f] rounded-xl p-4 flex items-center gap-4 transition-all duration-300 group"
                        >
                          <div className="text-3xl">
                            <FaBook />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-green-300">
                              Online Book
                            </h3>
                            <p className="text-sm text-gray-400">
                              Read instantly in our reader (PDF)
                            </p>
                          </div>

                          <div className="text-green-400 font-semibold text-sm">
                            Instant
                          </div>
                        </div>

                        {/* 📦 Physical Book */}
                        <div
                          onClick={() => {
                            handlePhysicalPurchase();
                            setShowPurchaseModal(false);
                          }}
                          className="cursor-pointer border border-gray-700 hover:border-blue-400 bg-[#122a2f] hover:bg-[#16383f] rounded-xl p-4 flex items-center gap-4 transition-all duration-300 group"
                        >
                          <div className="text-3xl">
                            <BsBoxSeamFill />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300">
                              Physical Book
                            </h3>
                            <p className="text-sm text-gray-400">
                              Get a printed copy delivered to your home
                            </p>
                          </div>

                          <div className="text-blue-400 font-semibold text-sm">
                            2-5 Days
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <button
                        onClick={() => setShowPurchaseModal(false)}
                        className="w-full mt-6 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {readMsg && (
                  <p
                    className={`text-sm text-red-400 mt-2 transition-all duration-300 ${
                      readMsg
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2"
                    }`}
                  >
                    {readMsg}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Give Rating */}
          <div className="mt-6 bg-[#1b2e31] p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Give Rating</h3>

            {/* Stars */}
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`cursor-pointer text-2xl transition duration-200 ${
                    star <= (hoverRating || userRating)
                      ? "text-yellow-400 scale-110"
                      : "text-gray-500"
                  }`}
                />
              ))}
            </div>

            {/* Review */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write review..."
              className="w-full p-2 rounded bg-[#0f2a2c]"
            />

            <button
              onClick={submitRating}
              className="mt-3 px-4 py-2 bg-amber-400 hover:bg-amber-500 font-semibold transition text-black rounded cursor-pointer"
            >
              Submit
            </button>
          </div>

          {/* Show all reviews */}
          <div className="mt-6 bg-[#1b2e31] p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">All Reviews</h3>

            {ratingsList.map((r) => (
              <div key={r._id} className="border-b border-gray-700 py-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-amber-300">
                    {r.user?.name || "User"}
                  </p>

                  <button
                    onClick={() => deleteReview(r._id)}
                    className="text-xs text-red-400 hover:text-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex text-yellow-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="text-gray-300 text-sm mt-1">{r.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
