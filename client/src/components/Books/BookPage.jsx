import React from "react";
import { IoMdHeart } from "react-icons/io";

const items = [
  {
    image: "https://example.com/images/image1.jpg",
    imageName: "Sunset Over Beach",
    favicon: "https://example.com/favicons/user1.png",
    authorName: "John Doe",
    viewers: 1200,
  },
  {
    image: "https://example.com/images/image2.jpg",
    imageName: "Mountain Landscape",
    favicon: "https://example.com/favicons/user2.png",
    authorName: "Jane Smith",
    viewers: 875,
  },
  {
    image: "https://example.com/images/image3.jpg",
    imageName: "City Skyline at Night",
    favicon: "https://example.com/favicons/user3.png",
    authorName: "Alex Johnson",
    viewers: 1520,
  },
  {
    image: "https://example.com/images/image4.jpg",
    imageName: "Forest Trail",
    favicon: "https://example.com/favicons/user4.png",
    authorName: "Maria Lee",
    viewers: 960,
  },
  {
    image: "https://example.com/images/image4.jpg",
    imageName: "Forest Trail",
    favicon: "https://example.com/favicons/user4.png",
    authorName: "Maria Lee",
    viewers: 960,
  },
  {
    image: "https://example.com/images/image4.jpg",
    imageName: "Forest Trail",
    favicon: "https://example.com/favicons/user4.png",
    authorName: "Maria Lee",
    viewers: 960,
  },
];

const BookPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-6">
      <h2 className="text-2xl font-bold text-[#dbf8fa] mb-6 text-center">
        All Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-[#1b2e31] rounded-xl overflow-hidden shadow-xl/40"
          >
            <img
              src={item.image}
              alt={item.imageName}
              className="w-full h-40 object-cover rounded-t-xl border-b"
            />
            <div className="p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-amber-50 truncate">
                  {item.imageName}
                </p>
                <IoMdHeart className="text-lg text-gray-400" />
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <p>{item.authorName}</p>
                <p className="text-yellow-300">{item.viewers}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;
