// import axios from "axios";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { IoMdHeart } from "react-icons/io";
// import { TbSend2 } from "react-icons/tb";
// import { useParams } from "react-router-dom";

// const product = {
//   image: "https://example.com/images/image1.jpg",
//   imageName: "Sunset Over Beach",
//   favicon: "https://example.com/favicons/user1.png",
//   authorName: "John Doe",
//   viewers: 1200,
//   description:
//     "An inspiring book capturing the essence of sunsets over the tranquil sea. Perfect for nature lovers and photographers.",
//   category: "Nature",
// };

// const SingleProductPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   const fetchSingleBook = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/book/${id}`);
//       setProduct(res.data);
//       console.log(res.data);
//     } catch (error) {
//       console.log("Error fetching books:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSingleBook();
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-[#0f1c1e] text-white px-4 py-8">
//       {/* {books.map((book) => ( */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-21 p-5 border border-gray-400">
//         {/* Image Section */}
//         <div>
//           <img
//             src={`http://localhost:5000/${product.coverPhoto}`}
//             alt={book.name}
//             className="w-full h-auto rounded-2xl border-2 border-amber-50"
//           />
//         </div>

//         {/* Details Section */}
//         <div className="flex flex-col gap-5">
//           <h1 className="text-3xl font-bold text-amber-300">
//             {product.imageName}
//           </h1>

//           <div className="flex items-center gap-4">
//             <img
//               src={product.favicon}
//               alt={product.authorName}
//               className="w-12 h-12 rounded-full border border-amber-50"
//             />
//             <div>
//               <p className="text-lg font-semibold text-[#dbf8fa]">
//                 {product.authorName}
//               </p>
//               <p className="text-sm text-gray-400">Author</p>
//             </div>
//           </div>

//           <p className="text-md text-gray-300">{product.description}</p>

//           <div className="flex justify-between text-sm text-gray-400 mt-4">
//             <span>
//               Category:{" "}
//               <span className="text-amber-300 font-semibold">
//                 {product.category}
//               </span>
//             </span>
//             <span>
//               Viewers:{" "}
//               <span className="text-yellow-300 font-bold">
//                 {product.viewers}
//               </span>
//             </span>
//           </div>

//           <div className="flex gap-4 mt-6">
//             <button className="bg-amber-300 text-black px-6 py-2 rounded-lg font-bold">
//               Borrow Now
//             </button>
//             <button className="border border-amber-300 text-amber-300 px-6 py-2 rounded-lg flex items-center gap-2">
//               <IoMdHeart className="text-lg" /> Wishlist
//             </button>
//           </div>

//           <div className="flex justify-between items-center mt-10 text-amber-300">
//             <p className="text-sm cursor-pointer">Share</p>
//             <TbSend2 className="text-xl cursor-pointer" />
//           </div>
//         </div>
//       </div>
//       {/* ))} */}
//     </div>
//   );
// };

// export default SingleProductPage;
