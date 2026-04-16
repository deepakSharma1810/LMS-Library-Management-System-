import React, { useEffect, useMemo, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

// const initialCart = [
//   {
//     id: 1,
//     image: "https://example.com/images/image1.jpg",
//     title: "Sunset Over Beach",
//     author: "John Doe",
//     price: 499,
//     originalPrice: 799,
//     qty: 1,
//   },
//   {
//     id: 2,
//     image: "https://example.com/images/image2.jpg",
//     title: "Mountain Landscape",
//     author: "Jane Smith",
//     price: 299,
//     originalPrice: 499,
//     qty: 2,
//   },
//   {
//     id: 3,
//     image: "https://example.com/images/image3.jpg",
//     title: "City Skyline at Night",
//     author: "Alex Johnson",
//     price: 399,
//     originalPrice: 599,
//     qty: 1,
//   },
// ];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const original = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
    const discount = original - subtotal;
    const delivery = subtotal > 699 || subtotal === 0 ? 0 : 49;
    const total = subtotal + delivery;
    return { subtotal, original, discount, delivery, total };
  }, [cart]);

  const updateQty = (id, delta) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
    );
    syncCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    syncCart(updatedCart);
  };

  const clearCart = () => syncCart([]);

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <FiShoppingCart className="text-2xl text-amber-300" />
            <div>
              <h1 className="text-2xl font-bold text-[#dbf8fa]">Your Cart</h1>
              <p className="text-sm text-gray-400">
                {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs md:text-sm px-3 py-2 bg-transparent border border-red-700 text-red-300 rounded hover:bg-red-900/10"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#122125] rounded-xl p-8 text-center">
            <p className="text-lg text-[#dbf8fa] mb-2">Your cart is empty 🛒</p>
            <p className="text-sm text-gray-400">
              Add some books to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#122125] rounded-xl p-4 flex gap-4 shadow-md"
                >
                  <img
                    src={`http://localhost:5000/${item.coverPhoto}`}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-lg border border-gray-700"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm md:text-base font-semibold text-[#dbf8fa]">
                        {item.name}
                      </h2>
                      <p className="text-xs text-gray-400 mb-1">
                        by{" "}
                        {item.author?.length > 0 ? item.author[0].name : "N/A"}
                      </p>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-base font-semibold text-amber-300">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-xs line-through text-gray-500">
                          {formatCurrency(item.mrp)}
                        </span>
                        <span className="text-xs text-green-400">
                          Save{" "}
                          {formatCurrency(
                            item.mrp * item.qty - item.price * item.qty,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 hover:bg-gray-800"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 hover:bg-gray-800"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-xs text-red-300 hover:text-red-400"
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#122125] rounded-xl p-5 shadow-md">
                <h2 className="text-lg font-semibold text-[#dbf8fa] mb-4">
                  Price Details
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      Price ({cart.length} items)
                    </span>
                    <span className="text-gray-200">
                      {formatCurrency(totals.original)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-300">Discount</span>
                    <span className="text-green-400">
                      -{formatCurrency(totals.discount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-300">Delivery Charges</span>
                    <span className="text-gray-200">
                      {totals.delivery === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        formatCurrency(totals.delivery)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-700 my-3"></div>

                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-[#dbf8fa]">
                      Total Amount
                    </span>
                    <span className="text-sm font-semibold text-amber-300">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <p className="text-xs text-green-400 mt-2">
                      You will save {formatCurrency(totals.discount)} on this
                      order 🎉
                    </p>
                  )}
                </div>

                <button className="w-full mt-5 py-2.5 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-500 transition">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
