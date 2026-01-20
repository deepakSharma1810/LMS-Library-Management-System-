// import React, { useMemo, useState } from "react";
// import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

// const initialCart = [
//   {
//     id: 1,
//     title: "Sunset Over Beach",
//     author: "John Doe",
//     image: "https://example.com/images/image1.jpg",
//     price: 499,
//     mrp: 799,
//     qty: 1,
//   },
//   {
//     id: 2,
//     title: "Mountain Landscape",
//     author: "Jane Smith",
//     image: "https://example.com/images/image2.jpg",
//     price: 299,
//     mrp: 499,
//     qty: 2,
//   },
// ];

// const formatCurrency = (n) =>
//   new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
//     n
//   );

// const CartPage = () => {
//   const [cart, setCart] = useState(initialCart);
//   const [coupon, setCoupon] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);

//   const totals = useMemo(() => {
//     const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//     const mrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.qty, 0);
//     const discountFromMrp = mrpTotal - subtotal;

//     let extraDiscount = 0;
//     if (appliedCoupon === "BOOK10") {
//       extraDiscount = Math.round(subtotal * 0.1);
//     }

//     const totalDiscount = discountFromMrp + extraDiscount;
//     const finalTotal = subtotal - extraDiscount;

//     return {
//       subtotal,
//       mrpTotal,
//       discountFromMrp,
//       extraDiscount,
//       totalDiscount,
//       finalTotal,
//     };
//   }, [cart, appliedCoupon]);

//   const updateQty = (id, delta) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item.id === id
//             ? { ...item, qty: Math.max(1, item.qty + delta) }
//             : item
//         )
//         .filter((item) => item.qty > 0)
//     );
//   };

//   const removeItem = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const applyCoupon = () => {
//     if (coupon.trim().toUpperCase() === "BOOK10") {
//       setAppliedCoupon("BOOK10");
//       alert("Coupon BOOK10 applied (10% off on subtotal)!");
//     } else {
//       setAppliedCoupon(null);
//       alert("Invalid coupon. Try BOOK10");
//     }
//   };

//   const handleCheckout = () => {
//     if (!cart.length) {
//       alert("Your cart is empty!");
//       return;
//     }
//     alert("Checkout clicked (integrate payment / address next).");
//   };

//   return (
//     <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] mb-6">
//           Your Cart
//         </h1>

//         {cart.length === 0 ? (
//           <div className="bg-[#122125] rounded-xl p-8 text-center text-gray-300">
//             <p className="text-lg mb-3">Your cart is empty</p>
//             <p className="text-sm text-gray-400">
//               Add some books to your cart and they will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-[#122125] rounded-xl p-4 flex gap-4 items-center"
//                 >
//                   {/* Image */}
//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="w-20 h-24 object-cover rounded-md border border-gray-700"
//                   />

//                   {/* Details */}
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-[#dbf8fa]">
//                       {item.title}
//                     </p>
//                     <p className="text-xs text-gray-400 mb-1">
//                       by {item.author}
//                     </p>

//                     <div className="flex items-center gap-2 text-sm mt-1">
//                       <span className="text-amber-300 font-semibold">
//                         {formatCurrency(item.price)}
//                       </span>
//                       <span className="text-xs text-gray-500 line-through">
//                         {formatCurrency(item.mrp)}
//                       </span>
//                     </div>

//                     {/* Qty controls */}
//                     <div className="mt-3 flex items-center gap-3">
//                       <div className="flex items-center border border-gray-700 rounded-md">
//                         <button
//                           onClick={() => updateQty(item.id, -1)}
//                           className="px-2 py-1 text-gray-300 hover:bg-gray-800"
//                         >
//                           <FiMinus />
//                         </button>
//                         <span className="px-3 py-1 text-sm">{item.qty}</span>
//                         <button
//                           onClick={() => updateQty(item.id, 1)}
//                           className="px-2 py-1 text-gray-300 hover:bg-gray-800"
//                         >
//                           <FiPlus />
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => removeItem(item.id)}
//                         className="flex items-center gap-1 text-xs text-red-300 hover:text-red-400"
//                       >
//                         <FiTrash2 /> Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="bg-[#122125] rounded-xl p-5 flex flex-col gap-4 h-fit">
//               <h2 className="text-lg font-semibold text-[#dbf8fa]">
//                 Price Details
//               </h2>

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Price ({cart.length} items)</span>
//                   <span>{formatCurrency(totals.mrpTotal)}</span>
//                 </div>
//                 <div className="flex justify-between text-green-400">
//                   <span>Discount</span>
//                   <span>-{formatCurrency(totals.discountFromMrp)}</span>
//                 </div>
//                 {totals.extraDiscount > 0 && (
//                   <div className="flex justify-between text-green-400">
//                     <span>Coupon Discount</span>
//                     <span>-{formatCurrency(totals.extraDiscount)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span>Delivery</span>
//                   <span className="text-green-400">Free</span>
//                 </div>

//                 <hr className="border-gray-700 my-2" />

//                 <div className="flex justify-between font-semibold text-amber-200">
//                   <span>Total Amount</span>
//                   <span>{formatCurrency(totals.finalTotal)}</span>
//                 </div>

//                 <p className="text-xs text-green-400 mt-1">
//                   You save {formatCurrency(totals.totalDiscount)} on this order.
//                 </p>
//               </div>

//               {/* Coupon */}
//               <div className="mt-4">
//                 <p className="text-xs text-gray-400 mb-1">
//                   Have a coupon? (Try{" "}
//                   <span className="text-amber-300">BOOK10</span>)
//                 </p>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={coupon}
//                     onChange={(e) => setCoupon(e.target.value)}
//                     placeholder="Enter coupon code"
//                     className="flex-1 px-3 py-2 bg-[#0f1f21] rounded-md border border-gray-700 text-sm text-gray-200 outline-none"
//                   />
//                   <button
//                     onClick={applyCoupon}
//                     className="px-3 py-2 bg-transparent border border-amber-300 text-amber-200 rounded-md text-sm hover:bg-amber-400 hover:text-black transition"
//                   >
//                     Apply
//                   </button>
//                 </div>
//                 {appliedCoupon && (
//                   <p className="text-xs text-green-400 mt-1">
//                     Applied: {appliedCoupon}
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={handleCheckout}
//                 className="mt-4 w-full px-4 py-3 bg-amber-400 text-black font-semibold rounded-md hover:bg-amber-500 transition"
//               >
//                 Proceed to Checkout
//               </button>

//               <p className="text-[11px] text-gray-400 text-center mt-1">
//                 Secure payment • Easy returns • 7 days replacement
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;

import React, { useMemo, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const initialCart = [
  {
    id: 1,
    image: "https://example.com/images/image1.jpg",
    title: "Sunset Over Beach",
    author: "John Doe",
    price: 499,
    originalPrice: 799,
    qty: 1,
  },
  {
    id: 2,
    image: "https://example.com/images/image2.jpg",
    title: "Mountain Landscape",
    author: "Jane Smith",
    price: 299,
    originalPrice: 499,
    qty: 2,
  },
  {
    id: 3,
    image: "https://example.com/images/image3.jpg",
    title: "City Skyline at Night",
    author: "Alex Johnson",
    price: 399,
    originalPrice: 599,
    qty: 1,
  },
];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const original = cart.reduce(
      (sum, item) => sum + item.originalPrice * item.qty,
      0
    );
    const discount = original - subtotal;
    const delivery = subtotal > 699 || subtotal === 0 ? 0 : 49;
    const total = subtotal + delivery;
    return { subtotal, original, discount, delivery, total };
  }, [cart]);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

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
                  key={item.id}
                  className="bg-[#122125] rounded-xl p-4 flex gap-4 shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded-lg border border-gray-700"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-sm md:text-base font-semibold text-[#dbf8fa]">
                        {item.title}
                      </h2>
                      <p className="text-xs text-gray-400 mb-1">
                        by {item.author}
                      </p>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-base font-semibold text-amber-300">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-xs line-through text-gray-500">
                          {formatCurrency(item.originalPrice)}
                        </span>
                        <span className="text-xs text-green-400">
                          Save{" "}
                          {formatCurrency(
                            item.originalPrice * item.qty -
                              item.price * item.qty
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
