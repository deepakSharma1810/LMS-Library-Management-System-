// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const SearchPage = () => {
// //   const [books, setBooks] = useState([]);
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const query = new URLSearchParams(location.search);
// //   const search = query.get("q");

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const res = await axios.get(
// //           `http://localhost:5000/book?search=${search}`,
// //         );
// //         setBooks(res.data.books);
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     };

// //     if (search) fetchData();
// //   }, [search]);

// //   // ✅ ADD TO CART
// //   const addToCart = (book) => {
// //     const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

// //     const alreadyExist = existingCart.find((item) => item._id === book._id);

// //     let updatedCart;

// //     if (alreadyExist) {
// //       updatedCart = existingCart.map((item) =>
// //         item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
// //       );
// //     } else {
// //       updatedCart = [...existingCart, { ...book, qty: 1 }];
// //     }

// //     localStorage.setItem("cart", JSON.stringify(updatedCart));
// //   };

// //   return (
// //     <div className="p-6 px-50 bg-[#0e1a1c] min-h-screen text-white">
// //       <h2 className="text-2xl mb-6 font-semibold">
// //         Results for: <span className="text-amber-300">{search}</span>
// //       </h2>

// //       <div className="space-y-6">
// //         {books.map((book) => {
// //           const discount =
// //             book.mrp && book.price
// //               ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
// //               : 0;

// //           return (
// //             <div
// //               key={book._id}
// //               className="flex flex-col md:flex-row gap-5 bg-[#1b2e31] p-4 rounded-xl border border-[#2c4449] hover:shadow-lg transition "
// //             >
// //               {/* IMAGE */}
// //               <div
// //                 className="w-full md:w-44 cursor-pointer"
// //                 onClick={() => navigate(`/book/${book._id}`)}
// //               >
// //                 <img
// //                   src={`http://localhost:5000/${book.coverPhoto}`}
// //                   alt={book.name}
// //                   className="w-full h-44 object-cover rounded-lg"
// //                 />
// //               </div>

// //               {/* DETAILS */}
// //               <div className="flex flex-col flex-1 justify-between">
// //                 {/* TITLE */}
// //                 <h3
// //                   onClick={() => navigate(`/book/${book._id}`)}
// //                   className="cursor-pointer text-lg font-semibold hover:text-amber-300 transition"
// //                 >
// //                   {book.name}
// //                 </h3>

// //                 {/* AUTHOR */}
// //                 <p className="text-sm text-gray-400">
// //                   by {book.author?.[0]?.name || "Unknown"}
// //                 </p>

// //                 {/*  RATING */}
// //                 <div className="flex items-center gap-2 text-sm">
// //                   <span className="text-amber-400">{book.rating || 4.2}</span>
// //                   <span className="text-gray-400">
// //                     ({book.reviews?.length || 120})
// //                   </span>
// //                 </div>

// //                 {/* PRICE */}
// //                 <div className="mt-2 flex items-center gap-2">
// //                   <span className="text-xl font-bold text-amber-300">
// //                     ₹{book.price}
// //                   </span>

// //                   {book.mrp && (
// //                     <span className="line-through text-gray-500">
// //                       ₹{book.mrp}
// //                     </span>
// //                   )}

// //                   {discount > 0 && (
// //                     <span className="text-green-400 text-sm">
// //                       {discount}% OFF
// //                     </span>
// //                   )}
// //                 </div>

// //                 {/* DESCRIPTION */}
// //                 <p className="text-sm text-gray-400 mt-2 line-clamp-2">
// //                   {book.description || "No description available"}
// //                 </p>

// //                 {/* BUTTON */}
// //                 <div className="mt-3 flex gap-3">
// //                   <button
// //                     onClick={() => addToCart(book)}
// //                     className="cursor-pointer bg-amber-300 text-black px-4 py-1 rounded-full font-semibold hover:bg-amber-400 transition"
// //                   >
// //                     Add to Cart
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* NO RESULT */}
// //       {books.length === 0 && (
// //         <p className="text-center text-gray-400 mt-10">No books found 😔</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default SearchPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const SearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [books, setBooks] = useState([]);
//   const [authors, setAuthors] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [popular, setPopular] = useState([]);
//   const [latest, setLatest] = useState([]);

//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [selectedAuthor, setSelectedAuthor] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const [activeAuthor, setActiveAuthor] = useState(null);
//   const [activeCategory, setActiveCategory] = useState(null);

//   const query = new URLSearchParams(location.search);
//   const search = query.get("q");

//   useEffect(() => {
//     if (!search) return;

//     const fetchAll = async () => {
//       try {
//         //  BOOKS + POPULAR + NEW
//         const res = await axios.get(
//           `http://localhost:5000/book?search=${search}`,
//         );

//         setBooks(res.data.books);
//         setPopular(res.data.popular);
//         setLatest(res.data.latest);

//         //  AUTHORS
//         const authorRes = await axios.get(
//           `http://localhost:5000/author?search=${search}`,
//         );
//         setAuthors(authorRes.data.authors);

//         //  CATEGORIES
//         const catRes = await axios.get("http://localhost:5000/category");
//         setCategories(catRes.data.categories);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchAll();
//   }, [search]);

//   // ADD TO CART
//   const addToCart = (book) => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const exist = cart.find((item) => item._id === book._id);

//     let updated;

//     if (exist) {
//       updated = cart.map((item) =>
//         item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
//       );
//     } else {
//       updated = [...cart, { ...book, qty: 1 }];
//     }

//     localStorage.setItem("cart", JSON.stringify(updated));
//   };

//   const handleAuthorClick = (authorId) => {
//     setActiveAuthor(authorId);
//     setActiveCategory(null);
//     setSelectedAuthor(authorId);
//     // setSelectedCategory(null);

//     const result = books.filter((b) =>
//       b.author?.some((a) => a._id === authorId),
//     );

//     setFilteredBooks(result);
//   };

//   const handleCategoryClick = (categoryId) => {
//     setActiveCategory(categoryId);
//     setActiveAuthor(null);
//     setSelectedCategory(categoryId);
//     // setSelectedAuthor(null);

//     const result = books.filter((b) => b.categories?.includes(categoryId));

//     setFilteredBooks(result);
//   };

//   return (
//     <div className="p-6 bg-[#0e1a1c] min-h-screen text-white">
//       <h2 className="text-2xl mb-6">
//         Results for: <span className="text-amber-300">{search}</span>
//       </h2>

//       {/* 🔥 BOOKS */}
//       <h3 className="text-xl mb-4">Books</h3>
//       <div className="space-y-4">
//         {books.map((book) => (
//           <div key={book._id} className="flex gap-4 bg-[#1b2e31] p-4 rounded">
//             <img
//               src={`http://localhost:5000/${book.coverPhoto}`}
//               className="w-28 h-32 object-cover cursor-pointer"
//               onClick={() => navigate(`/book/${book._id}`)}
//             />

//             <div className="flex-1">
//               <h4
//                 className="font-semibold cursor-pointer hover:text-amber-300"
//                 onClick={() => navigate(`/book/${book._id}`)}
//               >
//                 {book.name}
//               </h4>

//               <p className="text-sm text-gray-400">{book.author?.[0]?.name}</p>

//               <p className="text-amber-300 font-bold">₹{book.price}</p>

//               <button
//                 onClick={() => addToCart(book)}
//                 className="mt-2 bg-amber-300 text-black px-4 py-1 rounded"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔥 AUTHORS */}
//       <h3 className="text-xl mt-10 mb-4">Authors</h3>
//       <div className="flex gap-4 overflow-x-auto">
//         {authors.map((a) => (
//           <div
//             key={a._id}
//             onClick={() => handleAuthorClick(a._id)}
//             className={`px-4 py-2 rounded cursor-pointer transition
//             ${
//               activeAuthor === a._id
//                 ? "bg-amber-300 text-black"
//                 : "bg-[#1b2e31] hover:bg-[#2c4449]"
//             }`}
//           >
//             {a.name}
//           </div>
//         ))}
//       </div>

//       {(selectedAuthor || selectedCategory) && (
//         <>
//           {/* <h3 className="text-xl mt-10 mb-4">Filtered Results</h3> */}

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
//             {filteredBooks.map((book) => (
//               <div
//                 key={book._id}
//                 className="bg-[#1b2e31] p-3 rounded cursor-pointer"
//                 onClick={() => navigate(`/book/${book._id}`)}
//               >
//                 <img
//                   src={`http://localhost:5000/${book.coverPhoto}`}
//                   className="h-40 w-full object-cover"
//                 />
//                 <p className="mt-2">{book.name}</p>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* 🔥 CATEGORIES */}
//       <h3 className="text-xl mt-10 mb-4">Categories</h3>
//       <div className="flex gap-3 flex-wrap">
//         {categories.map((c) => (
//           <button
//             key={c._id}
//             onClick={() => handleCategoryClick(c._id)}
//             className={`px-3 py-1 rounded transition
//             ${
//               activeCategory === c._id
//                 ? "bg-amber-300 text-black"
//                 : "bg-[#1b2e31] hover:bg-[#2c4449]"
//             }`}
//           >
//             {c.name}
//           </button>
//         ))}
//       </div>

//       {(selectedAuthor || selectedCategory) && (
//         <>
//           {/* <h3 className="text-xl mt-10 mb-4">Filtered Results</h3> */}

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
//             {filteredBooks.map((book) => (
//               <div
//                 key={book._id}
//                 className="bg-[#1b2e31] p-3 rounded cursor-pointer"
//                 onClick={() => navigate(`/book/${book._id}`)}
//               >
//                 <img
//                   src={`http://localhost:5000/${book.coverPhoto}`}
//                   className="h-40 w-full object-cover"
//                 />
//                 <p className="mt-2">{book.name}</p>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/*  POPULAR */}
//       <h3 className="text-xl mt-10 mb-4">Popular Books</h3>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {popular.map((book) => (
//           <div
//             key={book._id}
//             className="bg-[#1b2e31] p-3 rounded cursor-pointer"
//             onClick={() => navigate(`/book/${book._id}`)}
//           >
//             <img
//               src={`http://localhost:5000/${book.coverPhoto}`}
//               className="h-40 w-full object-cover"
//             />
//             <p className="mt-2">{book.name}</p>
//           </div>
//         ))}
//       </div>

//       {/*  NEW BOOKS */}
//       <h3 className="text-xl mt-10 mb-4">New Books</h3>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {latest.map((book) => (
//           <div
//             key={book._id}
//             className="bg-[#1b2e31] p-3 rounded cursor-pointer"
//             onClick={() => navigate(`/book/${book._id}`)}
//           >
//             <img
//               src={`http://localhost:5000/${book.coverPhoto}`}
//               className="h-40 w-full object-cover"
//             />
//             <p className="mt-2">{book.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const addToCart = (book) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exist = cart.find((item) => item._id === book._id);

  const updated = exist
    ? cart.map((item) =>
        item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
      )
    : [...cart, { ...book, qty: 1 }];

  localStorage.setItem("cart", JSON.stringify(updated));
};

const BookRow = ({ book, onNavigate }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  const discount =
    book.mrp && book.price
      ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex gap-4 bg-[#162428] border border-[#1f3a3e] hover:border-amber-300/20 rounded-2xl p-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,200,220,0.07)]">
      <div
        className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#1f3338] cursor-pointer"
        onClick={() => onNavigate(book._id)}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
        )}

        <img
          src={`http://localhost:5000/${book.coverPhoto}`}
          alt={book.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h4
            className="text-sm font-semibold text-[#dbf8fa] cursor-pointer hover:text-amber-300 transition truncate"
            onClick={() => onNavigate(book._id)}
          >
            {book.name}
          </h4>

          <p className="text-xs text-[#4a8a92] mt-0.5">
            {book.author?.[0]?.name || "Unknown"}
          </p>

          <div className="flex items-center gap-1.5 mt-1.5">
            <FaStar className="text-amber-400 text-xs" />
            <span className="text-xs text-amber-300">{book.rating || 4.2}</span>
            <span className="text-xs text-[#2a5a62]">
              ({book.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-base font-bold text-[#dbf8fa]">
              ₹{book.price}
            </span>

            {book.mrp && (
              <span className="text-xs line-through text-[#2a5a62]">
                ₹{book.mrp}
              </span>
            )}

            {discount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                {discount}% OFF
              </span>
            )}
          </div>

          <p className="text-xs text-[#4a8a92] mt-1.5 line-clamp-2 leading-relaxed">
            {book.description || "No description available"}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className={`self-start mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            added
              ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
              : "bg-amber-400 text-black hover:bg-amber-500"
          }`}
        >
          <FiShoppingCart className="text-xs" />
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const BookCard = ({ book, onNavigate }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onNavigate(book._id)}
      className="group bg-[#162428] border border-[#1f3a3e] hover:border-amber-300/20 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,200,220,0.08)] transition-all duration-300"
    >
      <div className="relative h-40 bg-[#1f3338]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#1f3338] animate-pulse" />
        )}

        <img
          src={`http://localhost:5000/${book.coverPhoto}`}
          alt={book.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="p-3">
        <p className="text-xs font-semibold text-[#dbf8fa] truncate group-hover:text-amber-300 transition">
          {book.name}
        </p>

        {book.price && (
          <p className="text-xs text-amber-300 font-bold mt-1">₹{book.price}</p>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-4">
    <h3 className="text-base font-semibold text-[#dbf8fa]">{title}</h3>

    {count > 0 && (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/10 border border-amber-300/20 text-amber-300 font-medium">
        {count}
      </span>
    )}
  </div>
);

const SkeletonRow = () => (
  <div className="flex gap-4 bg-[#162428] border border-[#1f3a3e] rounded-2xl p-4 animate-pulse">
    <div className="w-24 h-32 rounded-xl bg-[#1f3338] flex-shrink-0" />

    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-4 w-2/3 bg-[#1f3338] rounded-full" />
      <div className="h-3 w-1/4 bg-[#1f3338] rounded-full" />
      <div className="h-3 w-1/3 bg-[#1f3338] rounded-full mt-1" />
      <div className="h-4 w-1/4 bg-[#1f3338] rounded-full" />
      <div className="h-8 w-28 bg-[#1f3338] rounded-xl mt-auto" />
    </div>
  </div>
);

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [latest, setLatest] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search);
  const search = query.get("q");

  useEffect(() => {
    if (!search) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [bookRes, authorRes, catRes] = await Promise.all([
          axios.get(`http://localhost:5000/book?search=${search}`),
          axios.get(`http://localhost:5000/author?search=${search}`),
          axios.get("http://localhost:5000/category"),
        ]);

        setBooks(bookRes.data.books || []);
        setPopular(bookRes.data.popular || []);
        setLatest(bookRes.data.latest || []);
        setAuthors(authorRes.data.authors || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [search]);

  const handleAuthorClick = (authorId) => {
    if (activeAuthor === authorId) {
      setActiveAuthor(null);
      setFilteredBooks([]);
      return;
    }

    setActiveAuthor(authorId);
    setActiveCategory(null);
    setFilteredBooks(
      books.filter((b) => b.author?.some((a) => a._id === authorId)),
    );
  };

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setFilteredBooks([]);
      return;
    }

    setActiveCategory(categoryId);
    setActiveAuthor(null);
    setFilteredBooks(books.filter((b) => b.categories?.includes(categoryId)));
  };

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-10 py-10 text-[#e8f8fa]">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
            <FiSearch className="text-amber-300" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#dbf8fa] tracking-tight">
              Results for <span className="text-amber-300">"{search}"</span>
            </h2>

            {!loading && (
              <p className="text-xs text-[#4a8a92] mt-0.5">
                {books.length} books found
              </p>
            )}
          </div>
        </div>

        <section>
          <SectionHeader title="Books" count={books.length} />

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : books.length === 0 ? (
              <div className="bg-[#162428] border border-[#1f3a3e] rounded-2xl p-10 text-center">
                <p className="text-3xl mb-2">📚</p>
                <p className="text-[#dbf8fa] font-medium">No books found</p>
                <p className="text-xs text-[#4a8a92] mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              books.map((book) => (
                <BookRow
                  key={book._id}
                  book={book}
                  onNavigate={(id) => navigate(`/book/${id}`)}
                />
              ))
            )}
          </div>
        </section>

        {(loading || authors.length > 0) && (
          <section>
            <SectionHeader title="Authors" count={authors.length} />

            <div className="flex gap-2 flex-wrap">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-9 w-24 bg-[#162428] border border-[#1f3a3e] rounded-xl animate-pulse"
                    />
                  ))
                : authors.map((a) => (
                    <button
                      key={a._id}
                      onClick={() => handleAuthorClick(a._id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        activeAuthor === a._id
                          ? "bg-amber-400 text-black border-amber-400"
                          : "bg-[#162428] border-[#1f3a3e] text-[#4a8a92] hover:text-amber-300 hover:border-amber-300/20"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#0e1a1c] border border-[#1f3a3e] flex items-center justify-center text-[8px] font-bold text-amber-300">
                        {a.name?.[0]}
                      </div>
                      {a.name}
                    </button>
                  ))}
            </div>
          </section>
        )}

        {(activeAuthor || activeCategory) && filteredBooks.length > 0 && (
          <section>
            <SectionHeader
              title="Filtered Results"
              count={filteredBooks.length}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onNavigate={(id) => navigate(`/book/${id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {(loading || categories.length > 0) && (
          <section>
            <SectionHeader title="Categories" count={categories.length} />

            <div className="flex gap-2 flex-wrap">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-20 bg-[#162428] border border-[#1f3a3e] rounded-xl animate-pulse"
                    />
                  ))
                : categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCategoryClick(c._id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        activeCategory === c._id
                          ? "bg-amber-400 text-black border-amber-400"
                          : "bg-[#162428] border-[#1f3a3e] text-[#4a8a92] hover:text-amber-300 hover:border-amber-300/20"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
            </div>
          </section>
        )}

        {(loading || popular.length > 0) && (
          <section>
            <SectionHeader title="Popular Books" count={popular.length} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-52 bg-[#162428] border border-[#1f3a3e] rounded-2xl animate-pulse"
                    />
                  ))
                : popular.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onNavigate={(id) => navigate(`/book/${id}`)}
                    />
                  ))}
            </div>
          </section>
        )}

        {(loading || latest.length > 0) && (
          <section>
            <SectionHeader title="New Books" count={latest.length} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-52 bg-[#162428] border border-[#1f3a3e] rounded-2xl animate-pulse"
                    />
                  ))
                : latest.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onNavigate={(id) => navigate(`/book/${id}`)}
                    />
                  ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
