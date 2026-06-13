import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import API_URL from "../../Constant";

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
          src={`${API_URL}/${book.coverPhoto}`}
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
          src={`${API_URL}/${book.coverPhoto}`}
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
          axios.get(`${API_URL}/book?search=${search}`),
          axios.get(`${API_URL}/author?search=${search}`),
          axios.get(`${API_URL}/category`),
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
