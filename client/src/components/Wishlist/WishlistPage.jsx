import React, { useEffect, useState } from "react";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const syncWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    syncWishlist(updated);
  };

  const clearWishlist = () => {
    syncWishlist([]);
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((c) => c._id === item._id);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((c) =>
        c._id === item._id ? { ...c, qty: c.qty + 1 } : c,
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: item._id,
          image: `http://localhost:5000/${item.coverPhoto}`,
          title: item.name,
          price: item.price,
          originalPrice: item.mrp || item.price + 200,
          qty: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // alert("Added to cart ✅");
    setAddedId(item._id);

    setTimeout(() => {
      setAddedId(null);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FiHeart className="text-2xl text-red-400" />
            <h1 className="text-2xl font-bold text-[#dbf8fa]">Your Wishlist</h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-sm px-3 py-2 border border-red-500 text-red-300 rounded hover:bg-red-900/10 cursor-pointer"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty */}
        {wishlist.length === 0 ? (
          <div className="bg-[#122125] p-8 rounded-xl text-center">
            <p className="text-lg text-[#dbf8fa]">Your wishlist is empty ❤️</p>
            <p className="text-sm text-gray-400 mt-2">
              Add books to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-[#122125] rounded-xl p-4 shadow-md flex flex-col"
              >
                <img
                  src={`http://localhost:5000/${item.coverPhoto}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />

                <h2 className="text-sm font-semibold text-[#dbf8fa] line-clamp-2">
                  {item.name}
                </h2>

                <p className="text-xs text-gray-400 mb-2">₹{item.price}</p>

                {/* Buttons */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 rounded transition-all duration-300 ease-in-out transform ${addedId === item._id ? "bg-green-500 text-white" : "bg-amber-300 text-black hover:bg-amber-400 "}`}
                  >
                    <FiShoppingCart />
                    {addedId === item._id ? "Added" : "Add to Cart"}
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex items-center justify-center px-2 py-1 text-red-400 border border-red-400 rounded hover:bg-red-900/20 cursor-pointer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
