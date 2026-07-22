import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { FaStar, FaShippingFast, FaBook } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FiShoppingCart, FiTrash2, FiX } from "react-icons/fi";
import axios from "axios";
import API_URL from "../../Constant";

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );

// ─── STARS ────────────────────────────────────────────────────────────────────

const Stars = ({ value = 0 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <FaStar key={i} className="text-sm" />;
        if (i === full && half)
          return <FaStar key={i} className="text-sm opacity-50" />;
        return <FaStar key={i} className="text-sm opacity-20" />;
      })}
    </div>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10">
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="h-4 w-48 bg-[#1f3338] rounded-full mb-6" />
      <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-80 bg-[#1f3338] rounded-2xl flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-8 w-2/3 bg-[#1f3338] rounded-full" />
            <div className="h-4 w-1/3 bg-[#1f3338] rounded-full" />
            <div className="h-6 w-1/4 bg-[#1f3338] rounded-full mt-2" />
            <div className="h-4 w-full bg-[#1f3338] rounded-full mt-2" />
            <div className="h-4 w-5/6 bg-[#1f3338] rounded-full" />
            <div className="h-4 w-4/6 bg-[#1f3338] rounded-full" />
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-28 bg-[#1f3338] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const SingleBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [CartBtnText, setCartBtnText] = useState("Add to Cart");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingsList, setRatingsList] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [showCartModal, setShowCartModal] = useState(false);

  const fetchSingleBook = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await axios.get(`${API_URL}/book/${id}`);

      setBook(res.data.getBook);
      console.log(res.data);
    } catch (error) {
      console.log("Error fetching book:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBook();
  }, [id]);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${API_URL}/rating/${book._id}`);
      setRatingsList(res.data.ratings);
      const userId = localStorage.getItem("userId");
      const myReview = res.data.ratings.find((r) => r.user?._id === userId);
      if (myReview) {
        setUserReview(myReview);
        setUserRating(myReview.rating);
        setReviewText(myReview.review);
      } else {
        setUserReview(null);
        setUserRating(0);
        setReviewText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (book?._id) fetchRatings();
  }, [book]);

  useEffect(() => {
    if (!book) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(!!wishlist.find((item) => item._id === book._id));
  }, [book]);

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exist = wishlist.find((item) => item._id === book._id);
    const updated = exist
      ? wishlist.filter((i) => i._id !== book._id)
      : [...wishlist, book];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setIsWishlisted(!exist);
  };

  // const handleAddToCart = () => {
  //   const existing = JSON.parse(localStorage.getItem("cart")) || [];
  //   const found = existing.find((item) => item._id === book._id);
  //   const updated = found
  //     ? existing.map((item) =>
  //         item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
  //       )
  //     : [...existing, { ...book, qty: 1 }];
  //   localStorage.setItem("cart", JSON.stringify(updated));
  //   setCartBtnText("Added ✓");
  //   setTimeout(() => setCartBtnText("Add to Cart"), 1500);
  // };

  const handleAddToCart = () => {
    setShowCartModal(true);
    // if (book.bookType === "physical") {
    //   addToCart("physical");
    // } else if (book.bookType === "ebook") {
    //   addToCart("ebook");
    // } else {
    //   setShowCartModal(true);
    // }

    if (
      book.bookType.includes("physical") &&
      !book.bookType.includes("ebook")
    ) {
      addToCart("physical");
    } else if (
      book.bookType.includes("ebook") &&
      !book.bookType.includes("physical")
    ) {
      addToCart("ebook");
    } else {
      setShowCartModal(true);
    }
  };

  const addToCart = (selectedType) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];

    const found = existing.find(
      (item) => item._id === book._id && item.bookType === selectedType,
    );

    const updated = found
      ? existing.map((item) =>
          item._id === book._id && item.bookType === selectedType
            ? { ...item, qty: item.qty + 1 }
            : item,
        )
      : [
          ...existing,
          {
            ...book,
            qty: 1,
            bookType: selectedType,
          },
        ];

    localStorage.setItem("cart", JSON.stringify(updated));

    setCartBtnText("Added ✓");

    setTimeout(() => {
      setCartBtnText("Add to Cart");
    }, 1500);
  };

  const handleOnlinePurchase = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        type: "buyNow",
        product: {
          ...book,
          qty: 1,
          bookType: "ebook",
          // bookType: book.bookType,
          // purchaseType: "ebook",
        },
      },
    });
  };

  const handlePhysicalPurchase = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        type: "buyNow",
        product: {
          ...book,
          qty: 1,
          bookType: "physical",
          // bookType: book.bookType,
          // purchaseType: "physical",
        },
      },
    });
  };

  const submitRating = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setReviewLoading(true);

      await axios.post(
        `${API_URL}/rating/add`,
        { rating: userRating, review: reviewText, bookId: book._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchRatings();
      fetchSingleBook(false);
    } catch (err) {
      console.log(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const deleteReview = async (rid) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_URL}/rating/${rid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRatings();
      fetchSingleBook();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadBook = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/book/read/${book._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        navigate(`/read/${book._id}`);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Access denied");
    }
  };

  if (loading) return <Skeleton />;

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c]">
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#dbf8fa] mb-4">
            Book not found
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-[#162428] border border-[#1f3a3e] text-[#4a8a92] hover:text-[#2dd4e0] transition text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#4a8a92] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#2dd4e0] transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/books" className="hover:text-[#2dd4e0] transition">
            Books
          </Link>
          <span>/</span>
          <span className="text-[#dbf8fa] font-semibold truncate max-w-xs">
            {book.name}
          </span>
        </nav>

        {/* Main Card */}
        <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="flex-shrink-0 w-full md:w-60">
              <div className="relative rounded-2xl overflow-hidden bg-[#1f3338] aspect-[3/4]">
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
                )}
                <img
                  src={`${API_URL}/${book.coverPhoto}`}
                  alt={book.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] leading-tight">
                  {book.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1f3338] border border-[#2dd4e0]/20 flex items-center justify-center text-xs text-[#2dd4e0] font-bold">
                      {book.author?.[0]?.name?.[0] || "A"}
                    </div>
                    <p className="text-sm text-[#6bbcc4]">
                      {book.author?.[0]?.name || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={book.rating || 0} />
                    <span className="text-xs text-[#4a8a92]">
                      {book.rating || 0} • {book.reviews || 0} reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-[#0e1a1c] rounded-xl border border-[#1f3a3e] px-4 py-3 inline-flex flex-col gap-1 w-fit">
                <span className="text-[10px] text-[#4a8a92] uppercase tracking-wider">
                  Price
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#dbf8fa]">
                    {formatCurrency(book.price)}
                  </span>
                  <span className="text-sm line-through text-[#2a5a62]">
                    {formatCurrency(book.mrp)}
                  </span>
                  {book.discountPercent > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                      {book.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#2a5a62]">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Delivery */}
              {book.deliveryEstimate && (
                <div className="flex items-center gap-2 text-sm text-[#4a8a92]">
                  <FaShippingFast className="text-[#2dd4e0]" />
                  <span>{book.deliveryEstimate}</span>
                  <span className="text-xs text-[#2a5a62]">
                    · Free above ₹499
                  </span>
                </div>
              )}

              {/* Seller */}
              {book.seller?.name && (
                <div className="text-xs text-[#4a8a92]">
                  Sold by{" "}
                  <span className="text-[#6bbcc4] font-medium">
                    {book.seller.name}
                  </span>
                  {book.seller?.rating && (
                    <span className="ml-2 text-[#2a5a62]">
                      Rating: {book.seller.rating}/5
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#6bbcc4] leading-relaxed">
                {book.description}
              </p>

              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-[#1f3a3e] rounded-xl p-4 bg-[#0e1a1c] w-full overflow-hidden">
                {[
                  ["ISBN", book.isbn],
                  ["Publisher", book.publisher],
                  ["Pages", book.pages],
                  ["Language", book.language],
                  ["Dimensions", book.dimensions],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col xs:flex-row sm:flex-row gap-1 sm:gap-2 min-w-0"
                    >
                      <span className="text-[#2a5a62] sm:w-20 flex-shrink-0">
                        {k}
                      </span>

                      <span className="text-[#6bbcc4] break-words leading-relaxed min-w-0">
                        {v}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap mt-1">
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="px-5 py-2.5 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-500 transition text-sm cursor-pointer"
                >
                  Buy Now
                </button>

                {/* <Link to={`/read/${id}`}>
                  <button className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition text-sm">
                    Read Book
                  </button>
                </Link> */}

                <button
                  onClick={handleReadBook}
                  className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 transition text-sm cursor-pointer"
                >
                  Read Book
                </button>

                <button
                  onClick={handleAddToCart}
                  className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                    CartBtnText !== "Add to Cart"
                      ? "bg-[#2dd4e0]/10 border-[#2dd4e0]/30 text-[#2dd4e0]"
                      : "bg-[#162428] border-[#1f3a3e] text-[#4a8a92] hover:border-[#2dd4e0]/30 hover:text-[#2dd4e0] cursor-pointer"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiShoppingCart />
                    {CartBtnText}
                  </span>
                </button>

                <button
                  onClick={handleWishlist}
                  className="ml-auto flex items-center gap-1.5 text-sm text-[#4a8a92] hover:text-[#6bbcc4] transition cursor-pointer"
                >
                  <IoMdHeart
                    className={`text-xl transition ${isWishlisted ? "text-rose-400" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Give Rating */}
        <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
          <h3 className="text-base font-semibold text-[#dbf8fa] mb-4">
            Rate this Book
          </h3>

          {!localStorage.getItem("token") ? (
            <p className="text-sm text-[#4a8a92]">
              <Link to="/login" className="text-[#2dd4e0] hover:underline">
                Login
              </Link>{" "}
              to give a rating
            </p>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`cursor-pointer text-2xl transition-transform ${
                      star <= (hoverRating || userRating)
                        ? "text-amber-400 scale-110"
                        : "text-[#1f3338]"
                    }`}
                  />
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[#0e1a1c] border border-[#1f3a3e] text-sm text-[#dbf8fa] placeholder-[#2a5a62] outline-none focus:border-[#2dd4e0]/40 focus:ring-1 focus:ring-[#2dd4e0]/20 transition resize-none"
              />

              <button
                onClick={submitRating}
                disabled={reviewLoading}
                className="mt-3 px-5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-70 text-black font-bold rounded-xl text-sm transition flex items-center gap-2"
              >
                {reviewLoading
                  ? userReview
                    ? "Updating..."
                    : "Submitting..."
                  : userReview
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </>
          )}
        </div>

        {/* All Reviews */}
        <div className="bg-[#162428] rounded-2xl border border-[#1f3a3e] p-6">
          <h3 className="text-base font-semibold text-[#dbf8fa] mb-4">
            All Reviews{" "}
            <span className="text-[#4a8a92] font-normal text-sm">
              ({ratingsList.length})
            </span>
          </h3>

          {ratingsList.length === 0 ? (
            <p className="text-sm text-[#2a5a62]">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-4">
              {ratingsList.map((r) => (
                <div
                  key={r._id}
                  className="border-b border-[#1f3a3e] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1f3338] border border-[#2dd4e0]/10 flex items-center justify-center text-xs text-[#2dd4e0] font-bold">
                        {r.user?.fName?.[0] || "U"}
                      </div>
                      <p className="text-sm font-medium text-[#6bbcc4]">
                        {r.user?.fName || "User"}
                      </p>
                    </div>

                    {String(r.user?._id) ===
                      String(localStorage.getItem("userId")) && (
                      <button
                        onClick={() => deleteReview(r._id)}
                        className="flex items-center gap-1 text-xs text-red-400 cursor-pointer hover:text-red-300 transition"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </div>

                  <div className="flex gap-0.5 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < r.rating ? "text-amber-400" : "text-[#1f3338]"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#4a8a92] mt-1.5 leading-relaxed">
                    {r.review}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {/* {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#162428] border border-[#1f3a3e] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-[#dbf8fa]">
                Choose Format
              </h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-8 h-8 rounded-xl bg-[#0e1a1c] border border-[#1f3a3e] flex items-center justify-center text-[#4a8a92] hover:text-[#dbf8fa] transition"
              >
                <FiX />
              </button>
            </div>
            <p className="text-xs text-[#4a8a92] mb-5">
              Select how you want to enjoy this book
            </p>

            <div className="space-y-3">
              {(book.bookType === "ebook" || book.bookType === "both") && (
                <div
                  onClick={() => {
                    handleOnlinePurchase();
                    setShowPurchaseModal(false);
                  }}
                  className="cursor-pointer border border-[#1f3a3e] hover:border-emerald-400/40 bg-[#0e1a1c] hover:bg-emerald-400/5 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <FaBook />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#dbf8fa] group-hover:text-emerald-300 transition">
                      E-Book
                    </p>

                    <p className="text-xs text-[#4a8a92]">
                      Read instantly after successful payment
                    </p>
                  </div>

                  <span className="text-xs text-emerald-400 font-semibold">
                    Instant
                  </span>
                </div>
              )}

              {(book.bookType === "physical" || book.bookType === "both") && (
                <div
                  onClick={() => {
                    handlePhysicalPurchase();
                    setShowPurchaseModal(false);
                  }}
                  className="cursor-pointer border border-[#1f3a3e] hover:border-[#2dd4e0]/40 bg-[#0e1a1c] hover:bg-[#2dd4e0]/5 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2dd4e0]/10 border border-[#2dd4e0]/20 flex items-center justify-center text-[#2dd4e0]">
                    <BsBoxSeamFill />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#dbf8fa] group-hover:text-[#2dd4e0] transition">
                      Physical Book
                    </p>

                    <p className="text-xs text-[#4a8a92]">
                      Printed copy delivered to your address
                    </p>
                  </div>

                  <span className="text-xs text-[#2dd4e0] font-semibold">
                    Delivery
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPurchaseModal(false)}
              className="w-full mt-4 py-2 rounded-xl border border-[#1f3a3e] text-[#4a8a92] text-sm hover:text-[#6bbcc4] hover:border-[#2a5a62] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

      {showPurchaseModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setShowPurchaseModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#162428] border border-[#1f3a3e] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-[scaleIn_0.2s_ease-out]"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-[#dbf8fa]">
                Choose Format
              </h2>

              <button
                onClick={() => setShowPurchaseModal(false)}
                className="w-8 h-8 rounded-xl bg-[#0e1a1c] border border-[#1f3a3e] flex items-center justify-center text-[#4a8a92] hover:text-[#dbf8fa] transition cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <p className="text-xs text-[#4a8a92] mb-5">
              Select how you want to enjoy this book
            </p>

            <div className="space-y-3">
              {/* {(book.bookType === "ebook" || book.bookType === "both") && ( */}
              {book.bookType.includes("ebook") && (
                <div
                  onClick={() => {
                    handleOnlinePurchase();
                    setShowPurchaseModal(false);
                  }}
                  className="cursor-pointer border border-[#1f3a3e] hover:border-emerald-400/40 bg-[#0e1a1c] hover:bg-emerald-400/5 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                    <FaBook />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#dbf8fa] group-hover:text-emerald-300 transition">
                      E-Book
                    </p>

                    <p className="text-xs text-[#4a8a92]">
                      Read instantly after successful payment
                    </p>
                  </div>

                  <span className="text-xs text-emerald-400 font-semibold">
                    Instant
                  </span>
                </div>
              )}

              {/* {(book.bookType === "physical" || book.bookType === "both") && ( */}
              {book.bookType.includes("physical") && (
                <div
                  onClick={() => {
                    handlePhysicalPurchase();
                    setShowPurchaseModal(false);
                  }}
                  className="cursor-pointer border border-[#1f3a3e] hover:border-[#2dd4e0]/40 bg-[#0e1a1c] hover:bg-[#2dd4e0]/5 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2dd4e0]/10 border border-[#2dd4e0]/20 flex items-center justify-center text-[#2dd4e0] group-hover:scale-105 transition-transform duration-200">
                    <BsBoxSeamFill />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#dbf8fa] group-hover:text-[#2dd4e0] transition">
                      Physical Book
                    </p>

                    <p className="text-xs text-[#4a8a92]">
                      Printed copy delivered to your address
                    </p>
                  </div>

                  <span className="text-xs text-[#2dd4e0] font-semibold">
                    Delivery
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPurchaseModal(false)}
              className="w-full mt-4 py-2 rounded-xl border border-[#1f3a3e] text-[#4a8a92] text-sm hover:text-[#6bbcc4] hover:border-[#2a5a62] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setShowCartModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#18282d] border border-[#274149] rounded-2xl p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] animate-[scaleIn_0.2s_ease-out]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-[#E8F8FA]">
                Choose Format
              </h2>

              <button
                onClick={() => setShowCartModal(false)}
                className="w-8 h-8 rounded-xl border border-[#29505A] flex items-center justify-center text-[#6E9BA3] hover:text-white hover:border-cyan-400 transition-all duration-200 cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            <p className="text-xs text-[#6E9BA3] mb-5">
              Select how you want to enjoy this book
            </p>

            {/* Options */}
            <div className="space-y-3">
              {/* {(book.bookType === "ebook" || book.bookType === "both") && ( */}
              {book.bookType.includes("ebook") && (
                <div
                  onClick={() => {
                    addToCart("ebook");
                    setShowCartModal(false);
                  }}
                  className="cursor-pointer border border-[#21414A] hover:border-emerald-400/40 bg-[#132126] hover:bg-[#163036] rounded-xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0F3C35] border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                    <FaBook />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                      E-Book
                    </p>

                    <p className="text-xs text-[#6E9BA3]">
                      Read instantly after successful payment
                    </p>
                  </div>

                  <span className="text-xs text-emerald-400 font-semibold">
                    Instant
                  </span>
                </div>
              )}

              {/* {(book.bookType === "physical" || book.bookType === "both") && ( */}
              {book.bookType.includes("physical") && (
                <div
                  onClick={() => {
                    addToCart("physical");
                    setShowCartModal(false);
                  }}
                  className="cursor-pointer border border-[#21414A] hover:border-cyan-400/40 bg-[#132126] hover:bg-[#173038] rounded-xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#123845] border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform duration-200">
                    <BsBoxSeamFill />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                      Physical Book
                    </p>

                    <p className="text-xs text-[#6E9BA3]">
                      Printed copy delivered to your address
                    </p>
                  </div>

                  <span className="text-xs text-cyan-400 font-semibold">
                    Delivery
                  </span>
                </div>
              )}

              {!book.bookType.includes("ebook") &&
                !book.bookType.includes("physical") && (
                  <p className="text-center text-sm text-[#6E9BA3] py-6">
                    No formats available for this book right now.
                  </p>
                )}
            </div>

            {/* Footer */}
            <button
              onClick={() => setShowCartModal(false)}
              className="w-full mt-4 py-2 rounded-xl border border-[#29505A] text-[#6E9BA3] text-sm hover:text-white hover:border-cyan-400 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBookPage;
