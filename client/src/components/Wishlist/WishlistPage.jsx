import React, { useEffect, useState } from "react";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Constant";

// ─── WISHLIST CARD ─────────────────────────────────────────────────────────────

const WishlistCard = ({ item, onRemove }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((c) => c._id === item._id);
    const updated = exist
      ? cart.map((c) => (c._id === item._id ? { ...c, qty: c.qty + 1 } : c))
      : [...cart, { ...item, qty: 1 }];
    localStorage.setItem("cart", JSON.stringify(updated));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-[#162428] border border-[#1f3a3e] hover:border-[#2dd4e0]/20 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,200,220,0.08)] transition-all duration-300 flex flex-col">
      {/* Cover */}
      <div
        className="relative h-52 bg-[#1f3338] cursor-pointer"
        onClick={() => navigate(`/book/${item._id}`)}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
        )}
        <img
          src={`${item.coverPhoto}`}
          alt={item.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2
          className="text-sm font-semibold text-[#dbf8fa] line-clamp-2 leading-snug cursor-pointer hover:text-[#2dd4e0] transition"
          onClick={() => navigate(`/book/${item._id}`)}
        >
          {item.name}
        </h2>
        <p className="text-xs text-[#4a8a92]">
          {item.author?.[0]?.name || "Unknown"}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-[#dbf8fa]">
            ₹{item.price}
          </span>
          {item.mrp && item.mrp > item.price && (
            <>
              <span className="text-xs line-through text-[#2a5a62]">
                ₹{item.mrp}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all duration-200 ${
              added
                ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
                : "bg-amber-400 text-black hover:bg-amber-500"
            }`}
          >
            <FiShoppingCart className="text-xs" />
            {added ? "Added ✓" : "Add to Cart"}
          </button>

          <button
            onClick={() => onRemove(item._id)}
            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
          >
            <FiTrash2 className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
    setLoading(false);
  }, []);

  const syncWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const removeItem = (id) => syncWishlist(wishlist.filter((i) => i._id !== id));
  const clearWishlist = () => syncWishlist([]);

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
              <FiHeart className="text-xl text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#dbf8fa] tracking-tight">
                Your Wishlist
              </h1>
              {!loading && (
                <p className="text-sm text-[#4a8a92] mt-0.5">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  saved
                </p>
              )}
            </div>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition"
            >
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#162428] border border-[#1f3a3e] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-[#1f3338]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 w-3/4 bg-[#1f3338] rounded-full" />
                  <div className="h-3 w-1/2 bg-[#1f3338] rounded-full" />
                  <div className="h-4 w-1/3 bg-[#1f3338] rounded-full" />
                  <div className="h-8 bg-[#1f3338] rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl bg-[#162428] border border-[#1f3a3e] p-16 text-center">
            <FiHeart className="text-5xl text-rose-400/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#dbf8fa]">
              Your wishlist is empty
            </p>
            <p className="text-sm text-[#4a8a92] mt-1">
              Save books you love to see them here.
            </p>
            <button
              onClick={() => navigate("/books")}
              className="mt-5 px-6 py-2.5 rounded-xl bg-[#2dd4e0]/10 border border-[#2dd4e0]/20 text-[#2dd4e0] text-sm font-semibold hover:bg-[#2dd4e0]/20 transition"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {wishlist.map((item) => (
              <WishlistCard key={item._id} item={item} onRemove={removeItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
