// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const SearchPage = () => {
//   const [books, setBooks] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const query = new URLSearchParams(location.search);
//   const search = query.get("q");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/book?search=${search}`,
//         );
//         setBooks(res.data.books);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     if (search) fetchData();
//   }, [search]);

//   // ✅ ADD TO CART
//   const addToCart = (book) => {
//     const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

//     const alreadyExist = existingCart.find((item) => item._id === book._id);

//     let updatedCart;

//     if (alreadyExist) {
//       updatedCart = existingCart.map((item) =>
//         item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
//       );
//     } else {
//       updatedCart = [...existingCart, { ...book, qty: 1 }];
//     }

//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   return (
//     <div className="p-6 px-50 bg-[#0e1a1c] min-h-screen text-white">
//       <h2 className="text-2xl mb-6 font-semibold">
//         Results for: <span className="text-amber-300">{search}</span>
//       </h2>

//       <div className="space-y-6">
//         {books.map((book) => {
//           const discount =
//             book.mrp && book.price
//               ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
//               : 0;

//           return (
//             <div
//               key={book._id}
//               className="flex flex-col md:flex-row gap-5 bg-[#1b2e31] p-4 rounded-xl border border-[#2c4449] hover:shadow-lg transition "
//             >
//               {/* IMAGE */}
//               <div
//                 className="w-full md:w-44 cursor-pointer"
//                 onClick={() => navigate(`/book/${book._id}`)}
//               >
//                 <img
//                   src={`http://localhost:5000/${book.coverPhoto}`}
//                   alt={book.name}
//                   className="w-full h-44 object-cover rounded-lg"
//                 />
//               </div>

//               {/* DETAILS */}
//               <div className="flex flex-col flex-1 justify-between">
//                 {/* TITLE */}
//                 <h3
//                   onClick={() => navigate(`/book/${book._id}`)}
//                   className="cursor-pointer text-lg font-semibold hover:text-amber-300 transition"
//                 >
//                   {book.name}
//                 </h3>

//                 {/* AUTHOR */}
//                 <p className="text-sm text-gray-400">
//                   by {book.author?.[0]?.name || "Unknown"}
//                 </p>

//                 {/*  RATING */}
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-amber-400">{book.rating || 4.2}</span>
//                   <span className="text-gray-400">
//                     ({book.reviews?.length || 120})
//                   </span>
//                 </div>

//                 {/* PRICE */}
//                 <div className="mt-2 flex items-center gap-2">
//                   <span className="text-xl font-bold text-amber-300">
//                     ₹{book.price}
//                   </span>

//                   {book.mrp && (
//                     <span className="line-through text-gray-500">
//                       ₹{book.mrp}
//                     </span>
//                   )}

//                   {discount > 0 && (
//                     <span className="text-green-400 text-sm">
//                       {discount}% OFF
//                     </span>
//                   )}
//                 </div>

//                 {/* DESCRIPTION */}
//                 <p className="text-sm text-gray-400 mt-2 line-clamp-2">
//                   {book.description || "No description available"}
//                 </p>

//                 {/* BUTTON */}
//                 <div className="mt-3 flex gap-3">
//                   <button
//                     onClick={() => addToCart(book)}
//                     className="cursor-pointer bg-amber-300 text-black px-4 py-1 rounded-full font-semibold hover:bg-amber-400 transition"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* NO RESULT */}
//       {books.length === 0 && (
//         <p className="text-center text-gray-400 mt-10">No books found 😔</p>
//       )}
//     </div>
//   );
// };

// export default SearchPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [latest, setLatest] = useState([]);

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const query = new URLSearchParams(location.search);
  const search = query.get("q");

  useEffect(() => {
    if (!search) return;

    const fetchAll = async () => {
      try {
        //  BOOKS + POPULAR + NEW
        const res = await axios.get(
          `http://localhost:5000/book?search=${search}`,
        );

        setBooks(res.data.books);
        setPopular(res.data.popular);
        setLatest(res.data.latest);

        //  AUTHORS
        const authorRes = await axios.get(
          `http://localhost:5000/author?search=${search}`,
        );
        setAuthors(authorRes.data.authors);

        //  CATEGORIES
        const catRes = await axios.get("http://localhost:5000/category");
        setCategories(catRes.data.categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, [search]);

  // ADD TO CART
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((item) => item._id === book._id);

    let updated;

    if (exist) {
      updated = cart.map((item) =>
        item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
      );
    } else {
      updated = [...cart, { ...book, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleAuthorClick = (authorId) => {
    setActiveAuthor(authorId);
    setActiveCategory(null);
    setSelectedAuthor(authorId);
    // setSelectedCategory(null);

    const result = books.filter((b) =>
      b.author?.some((a) => a._id === authorId),
    );

    setFilteredBooks(result);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveAuthor(null);
    setSelectedCategory(categoryId);
    // setSelectedAuthor(null);

    const result = books.filter((b) => b.categories?.includes(categoryId));

    setFilteredBooks(result);
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen text-white">
      <h2 className="text-2xl mb-6">
        Results for: <span className="text-amber-300">{search}</span>
      </h2>

      {/* 🔥 BOOKS */}
      <h3 className="text-xl mb-4">Books</h3>
      <div className="space-y-4">
        {books.map((book) => (
          <div key={book._id} className="flex gap-4 bg-[#1b2e31] p-4 rounded">
            <img
              src={`http://localhost:5000/${book.coverPhoto}`}
              className="w-28 h-32 object-cover cursor-pointer"
              onClick={() => navigate(`/book/${book._id}`)}
            />

            <div className="flex-1">
              <h4
                className="font-semibold cursor-pointer hover:text-amber-300"
                onClick={() => navigate(`/book/${book._id}`)}
              >
                {book.name}
              </h4>

              <p className="text-sm text-gray-400">{book.author?.[0]?.name}</p>

              <p className="text-amber-300 font-bold">₹{book.price}</p>

              <button
                onClick={() => addToCart(book)}
                className="mt-2 bg-amber-300 text-black px-4 py-1 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 AUTHORS */}
      <h3 className="text-xl mt-10 mb-4">Authors</h3>
      <div className="flex gap-4 overflow-x-auto">
        {authors.map((a) => (
          <div
            key={a._id}
            onClick={() => handleAuthorClick(a._id)}
            className={`px-4 py-2 rounded cursor-pointer transition
            ${
              activeAuthor === a._id
                ? "bg-amber-300 text-black"
                : "bg-[#1b2e31] hover:bg-[#2c4449]"
            }`}
          >
            {a.name}
          </div>
        ))}
      </div>

      {(selectedAuthor || selectedCategory) && (
        <>
          {/* <h3 className="text-xl mt-10 mb-4">Filtered Results</h3> */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-[#1b2e31] p-3 rounded cursor-pointer"
                onClick={() => navigate(`/book/${book._id}`)}
              >
                <img
                  src={`http://localhost:5000/${book.coverPhoto}`}
                  className="h-40 w-full object-cover"
                />
                <p className="mt-2">{book.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔥 CATEGORIES */}
      <h3 className="text-xl mt-10 mb-4">Categories</h3>
      <div className="flex gap-3 flex-wrap">
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => handleCategoryClick(c._id)}
            className={`px-3 py-1 rounded transition
            ${
              activeCategory === c._id
                ? "bg-amber-300 text-black"
                : "bg-[#1b2e31] hover:bg-[#2c4449]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {(selectedAuthor || selectedCategory) && (
        <>
          {/* <h3 className="text-xl mt-10 mb-4">Filtered Results</h3> */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-[#1b2e31] p-3 rounded cursor-pointer"
                onClick={() => navigate(`/book/${book._id}`)}
              >
                <img
                  src={`http://localhost:5000/${book.coverPhoto}`}
                  className="h-40 w-full object-cover"
                />
                <p className="mt-2">{book.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/*  POPULAR */}
      <h3 className="text-xl mt-10 mb-4">Popular Books</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popular.map((book) => (
          <div
            key={book._id}
            className="bg-[#1b2e31] p-3 rounded cursor-pointer"
            onClick={() => navigate(`/book/${book._id}`)}
          >
            <img
              src={`http://localhost:5000/${book.coverPhoto}`}
              className="h-40 w-full object-cover"
            />
            <p className="mt-2">{book.name}</p>
          </div>
        ))}
      </div>

      {/*  NEW BOOKS */}
      <h3 className="text-xl mt-10 mb-4">New Books</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latest.map((book) => (
          <div
            key={book._id}
            className="bg-[#1b2e31] p-3 rounded cursor-pointer"
            onClick={() => navigate(`/book/${book._id}`)}
          >
            <img
              src={`http://localhost:5000/${book.coverPhoto}`}
              className="h-40 w-full object-cover"
            />
            <p className="mt-2">{book.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
