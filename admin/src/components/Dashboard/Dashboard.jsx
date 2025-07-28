import React from "react";
import { FiUsers } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { SlidersHorizontal } from "lucide-react";

// Stats Data
const stats = [
  {
    label: "Customers",
    value: "3,782",
    icon: <FiUsers className="text-xl text-[#1C2434]" />,
    change: "11.01%",
    up: true,
  },
  {
    label: "Authors",
    value: "1,563",
    icon: <FaUserEdit className="text-xl text-[#1C2434]" />,
    change: "5.22%",
    up: true,
  },
  {
    label: "Books",
    value: "8,459",
    icon: <MdOutlineLibraryBooks className="text-xl text-[#1C2434]" />,
    change: "9.05%",
    up: false,
  },
];

// Orders Data
const orders = [
  {
    image: "https://cdn-icons-png.flaticon.com/512/11286/11286506.png",
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    price: "$2399.00",
    category: "Laptop",
    status: "Delivered",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/9926/9926189.png",
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    price: "$879.00",
    category: "Watch",
    status: "Pending",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/8599/8599513.png",
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    price: "$1869.00",
    category: "SmartPhone",
    status: "Delivered",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/11514/11514091.png",
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    price: "$1699.00",
    category: "Electronics",
    status: "Canceled",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/512/11923/11923519.png",
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    price: "$240.00",
    category: "Accessories",
    status: "Delivered",
  },
];

const statusStyle = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Canceled: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl px-6 py-5 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F3F6F9] rounded-lg">{item.icon}</div>
                <div>
                  <p className="text-sm text-[#64748B]">{item.label}</p>
                  <h4 className="text-2xl font-bold text-[#0F172A]">
                    {item.value}
                  </h4>
                </div>
              </div>
              <div
                className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  item.up
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.up ? (
                  <FaArrowUp className="mr-1 text-sm" />
                ) : (
                  <FaArrowDown className="mr-1 text-sm" />
                )}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Recent Orders
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 border px-3 py-1.5 text-sm rounded-md shadow-sm text-[#0F172A]">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            <button className="border px-3 py-1.5 text-sm rounded-md shadow-sm text-[#0F172A]">
              See all
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-[#64748B] border-b">
                <th className="py-2">Products</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-[#0F172A]">
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-4 flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{order.name}</p>
                      <p className="text-sm text-[#64748B]">{order.variants}</p>
                    </div>
                  </td>
                  <td className="text-sm">{order.category}</td>
                  <td className="text-sm">{order.price}</td>
                  <td>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusStyle[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
