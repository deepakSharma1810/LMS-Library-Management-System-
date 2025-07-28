import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdHeart } from "react-icons/io";
import { RiEqualizerFill } from "react-icons/ri";
import { TbSend2 } from "react-icons/tb";

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

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const MainPage = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full h-[50vh]">
        <img src="" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-5 px-4 md:px-8 py-6">
        {/* Left Section */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          {/* Previous Reading */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl sm:text-2xl font-bold text-[#dbf8fa]">
                Previous Reading
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-yellow-300">Filter</p>
                <RiEqualizerFill className="text-yellow-300 rotate-90" />
              </div>
            </div>
            <Slider {...settings}>
              {items.map((item, index) => (
                <div key={index} className="px-2">
                  <div className=" rounded-lg overflow-hidden shadow-xl/40 max-w-xs mx-auto">
                    <img
                      src={item.image}
                      alt={item.imageName}
                      className="w-full h-48 object-cover border rounded-xl"
                    />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-amber-50 truncate">
                          {item.imageName}
                        </p>
                        <IoMdHeart className="text-xl text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-300 truncate">
                          {item.authorName}
                        </p>
                        <span className="text-xs text-yellow-300">
                          {item.viewers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Subjects Section */}
          <div className="w-full">
            <p className="text-xl font-bold text-[#dbf8fa] mb-3">
              Subjects section
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Science",
                "Arts",
                "Commerce",
                "Design",
                "Cooking",
                "Others",
              ].map((subject, i) => (
                <div
                  key={subject}
                  className={`flex justify-between items-center px-4 py-2 rounded-xl ${
                    subject === "Cooking" ? "bg-amber-300" : "bg-[#234046]"
                  }`}
                >
                  <p
                    className={`text-lg font-bold ${
                      subject === "Cooking" ? "" : "text-amber-300"
                    }`}
                  >
                    {subject}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      subject === "Cooking" ? "" : "text-amber-300"
                    }`}
                  >
                    {["1.2k", "1.8k", "230", "80", "180", "900"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl font-bold text-[#dbf8fa]">New books</p>
              <p className="text-amber-300">Show all</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {items.map((_, i) => (
                <div
                  key={i}
                  className="min-w-[150px] flex-shrink-0 flex flex-col rounded-xl shadow-xl/40"
                >
                  <div className="w-full h-40">
                    <img
                      src=""
                      alt=""
                      className="w-full h-full object-cover border rounded-xl"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-bold text-amber-50 truncate">
                      Book Name
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-300">
                      <span>Author Name</span>
                      <span className="text-yellow-300">234</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          {/* Popular Books */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-[18px]">
              <p className="text-xl font-bold text-[#dbf8fa]">Popular books</p>
              <p className="text-amber-300 text-sm">Show all</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <div key={i} className="rounded-lg shadow-xl/40">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                  <div className="p-2">
                    <p className="text-sm font-bold text-amber-50 truncate">
                      {item.imageName}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{item.authorName}</span>
                      <span className="text-yellow-300">{item.viewers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Writers and Authors */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xl font-bold text-[#dbf8fa]">
                Writers and Authors
              </p>
              <p className="text-amber-300 text-sm">Show all</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((_, i) => (
                <div
                  key={i}
                  className="bg-[#122125] rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-2">
                    <img
                      src=""
                      alt=""
                      className="w-12 h-12 rounded-full border border-amber-50"
                    />
                    <div className="text-right">
                      <p className="text-xs text-amber-300">766</p>
                      <p className="text-xs text-gray-400">Books</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#dbf8fa]">Writer Name</p>
                    <p className="text-xs text-gray-400">Writer & Author</p>
                    <div className="flex justify-between items-center text-amber-300 mt-1">
                      <p className="text-sm">More...</p>
                      <TbSend2 className="text-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
