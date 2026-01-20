import React, { useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiDownload,
} from "react-icons/fi";

const ordersMock = [
  {
    id: "ORD-20251201-001",
    date: "01 Dec 2025",
    status: "Delivered",
    total: 1097,
    itemsCount: 2,
    paymentMode: "UPI",
    address: "Deepak Sharma, 221B Baker Street, New Delhi, India",
    expected: "Delivered on 03 Dec 2025",
    items: [
      {
        title: "Sunset Over Beach",
        author: "John Doe",
        qty: 1,
        price: 499,
        image: "https://example.com/images/image1.jpg",
      },
      {
        title: "Mountain Landscape",
        author: "Jane Smith",
        qty: 1,
        price: 598,
        image: "https://example.com/images/image2.jpg",
      },
    ],
  },
  {
    id: "ORD-20251128-014",
    date: "28 Nov 2025",
    status: "Shipped",
    total: 299,
    itemsCount: 1,
    paymentMode: "Card",
    address: "Deepak Sharma, 4th Floor, Mumbai, India",
    expected: "Arriving by 05 Dec 2025",
    items: [
      {
        title: "Forest Trail",
        author: "Maria Lee",
        qty: 1,
        price: 299,
        image: "https://example.com/images/image4.jpg",
      },
    ],
  },
  {
    id: "ORD-20251120-005",
    date: "20 Nov 2025",
    status: "Cancelled",
    total: 520,
    itemsCount: 1,
    paymentMode: "COD",
    address: "Deepak Sharma, Jaipur, India",
    expected: "Order cancelled",
    items: [
      {
        title: "City Skyline at Night",
        author: "Alex Johnson",
        qty: 1,
        price: 520,
        image: "https://example.com/images/image3.jpg",
      },
    ],
  },
];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n
  );

const statusBadge = (status) => {
  const base = "px-2 py-[2px] rounded-full text-[10px] font-semibold";
  switch (status) {
    case "Delivered":
      return `${base} bg-green-900/40 text-green-300 border border-green-700/60`;
    case "Shipped":
      return `${base} bg-blue-900/40 text-blue-300 border border-blue-700/60`;
    case "Pending":
      return `${base} bg-yellow-900/40 text-yellow-300 border border-yellow-700/60`;
    case "Cancelled":
      return `${base} bg-red-900/40 text-red-300 border border-red-700/60`;
    default:
      return `${base} bg-gray-800 text-gray-300 border border-gray-600`;
  }
};

const statusIcon = (status) => {
  if (status === "Delivered")
    return <FiCheckCircle className="text-green-400 text-xl" />;
  if (status === "Shipped")
    return <FiTruck className="text-blue-400 text-xl" />;
  if (status === "Cancelled")
    return <FiXCircle className="text-red-400 text-xl" />;
  return <FiPackage className="text-yellow-300 text-xl" />;
};

const OrderPage = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const downloadInvoice = (order) => {
    alert(`Download invoice for ${order.id} (you can hook real PDF here).`);
  };

  const trackOrder = (order) => {
    alert(`Track order ${order.id} (integrate tracking page/URL).`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] mb-6">
          Your Orders
        </h1>

        {ordersMock.length === 0 ? (
          <div className="bg-[#122125] rounded-xl p-8 text-center text-gray-300">
            <p className="text-lg mb-3">No orders yet</p>
            <p className="text-sm text-gray-400">
              When you place an order, it will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersMock.map((order) => (
              <div
                key={order.id}
                className="bg-[#122125] rounded-xl p-4 md:p-5 shadow-lg"
              >
                {/* Top row: icon, status, basic info */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-[2px]">{statusIcon(order.status)}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[#dbf8fa]">
                          {order.status}
                        </span>
                        <span className={statusBadge(order.status)}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.expected}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Order ID:{" "}
                        <span className="text-gray-300">{order.id}</span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Ordered on:{" "}
                        <span className="text-gray-300">{order.date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side summary */}
                  <div className="text-right md:text-right">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-lg font-semibold text-amber-300">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {order.itemsCount} item
                      {order.itemsCount > 1 ? "s" : ""} • {order.paymentMode}
                    </p>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-gray-300 hover:text-amber-300"
                    >
                      <FiDownload /> Invoice
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-700 my-3" />

                {/* First item preview */}
                <div className="flex gap-3">
                  <img
                    src={order.items[0].image}
                    alt={order.items[0].title}
                    className="w-14 h-18 md:w-16 md:h-20 object-cover rounded-md border border-gray-700"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[#dbf8fa] font-medium">
                      {order.items[0].title}
                    </p>
                    <p className="text-xs text-gray-400">
                      by {order.items[0].author}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Qty: {order.items[0].qty}
                    </p>
                    {order.itemsCount > 1 && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        + {order.itemsCount - 1} more item
                        {order.itemsCount - 1 > 1 ? "s" : ""}
                      </p>
                    )}
                    <p className="text-sm text-amber-300 mt-1">
                      {formatCurrency(order.items[0].price)}
                    </p>
                  </div>
                </div>

                {/* Expand / collapse + actions */}
                <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-amber-300"
                  >
                    <FiChevronDown
                      className={`transition-transform ${
                        expanded === order.id ? "rotate-180" : ""
                      }`}
                    />
                    {expanded === order.id ? "Hide details" : "View details"}
                  </button>

                  <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                    {order.status !== "Cancelled" && (
                      <button
                        onClick={() => trackOrder(order)}
                        className="px-3 py-1 text-xs rounded-md bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800"
                      >
                        Track Order
                      </button>
                    )}
                    <button className="px-3 py-1 text-xs rounded-md bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800">
                      Buy Again
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === order.id && (
                  <div className="mt-4 bg-[#0e1a1c] rounded-lg p-3 md:p-4 border border-gray-800">
                    {/* Items list */}
                    <p className="text-xs font-semibold text-gray-300 mb-2">
                      Items in this order
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-center text-sm"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded border border-gray-700"
                          />
                          <div className="flex-1">
                            <p className="text-[13px] text-[#dbf8fa]">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              by {item.author}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              Qty: {item.qty}
                            </p>
                          </div>
                          <p className="text-[13px] text-amber-300">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Address + payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                      <div>
                        <p className="text-gray-400 mb-1">Delivery address</p>
                        <p className="text-gray-300">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Payment</p>
                        <p className="text-gray-300">
                          Mode: {order.paymentMode}
                        </p>
                        <p className="text-gray-300">
                          Order amount: {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
