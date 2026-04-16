import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { FaStar, FaShippingFast } from "react-icons/fa";
import axios from "axios";

const items = [
  {
    id: 1,
    image: "https://example.com/images/image1.jpg",
    imageName: "Sunset Over Beach",
    favicon: "https://example.com/favicons/user1.png",
    authorName: "John Doe",
    viewers: 1200,
    price: 499.0,
    mrp: 799.0,
    discountPercent: 38,
    rating: 4.5,
    reviews: 1285,
    stock: 12,
    description:
      "A beautiful coffee-table book featuring sunsets, beaches and serene landscapes. High-quality prints, premium paper.",
    features: [
      "Hardcover",
      "200 pages",
      "Trim size: 8.5 x 11 inches",
      "Publisher: NatureHouse",
      "Language: English",
    ],
    isbn: "978-1-23456-789-0",
    pages: 200,
    publisher: "NatureHouse",
    language: "English",
    dimensions: "21.6 x 28 x 2 cm",
    deliveryEstimate: "Deliver by Dec 6 - Dec 8",
    seller: { name: "BooksWorld", rating: 4.7, sellerLink: "#" },
  },
  {
    id: 2,
    image: "https://example.com/images/image2.jpg",
    imageName: "Mountain Landscape",
    favicon: "https://example.com/favicons/user2.png",
    authorName: "Jane Smith",
    viewers: 875,
    price: 299.0,
    mrp: 499.0,
    discountPercent: 40,
    rating: 4.2,
    reviews: 540,
    stock: 0,
    description:
      "Scenic mountain photography compiled into a compact, travel-friendly volume.",
    features: [
      "Paperback",
      "120 pages",
      "Publisher: PeakPress",
      "Language: English",
    ],
    isbn: "978-0-98765-432-1",
    pages: 120,
    publisher: "PeakPress",
    language: "English",
    dimensions: "15 x 22 x 1.5 cm",
    deliveryEstimate: "Deliver by Dec 7 - Dec 9",
    seller: { name: "PeakStore", rating: 4.4, sellerLink: "#" },
  },
];

const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n,
  );

const Stars = ({ value }) => {
  // show 5 stars with filled portion
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <FaStar key={i} />;
        if (i === full && half)
          return <FaStar key={i} style={{ opacity: 0.6 }} />;
        return <FaStar key={i} style={{ opacity: 0.2 }} />;
      })}
    </div>
  );
};

const SingleBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const book = items.find((b) => b.id === Number(id));
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [CartBtnText, setCartBtnText] = useState("Add to Cart");

  const fetchSingleBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/book/${id}`);
      setBook(res.data.getBook);
      console.log(res.data.getBook);
    } catch (error) {
      console.log("Error fetching book:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBook();
  }, [id]);

  const handleBuyBook = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/");
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const alreadyExist = existingCart.find((item) => item._id === book._id);

    let updatedCart;

    if (alreadyExist) {
      updatedCart = existingCart.map((item) =>
        item._id === book._id ? { ...item, qty: item.qty + 1 } : item,
      );
    } else {
      updatedCart = [...existingCart, { ...book, qty: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // navigate("/cart");

    setCartBtnText("Added to Cart");

    setTimeout(() => {
      setCartBtnText("Add to Cart");
    }, 1000);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1a1c]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-blue-600 rounded text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0e1a1c] px-4 md:px-8 py-8 text-gray-100">
      <div className="max-w-6xl mx-auto gap-8">
        {/* LEFT: Image + thumbnails (md: col-span-2) */}
        <div className="md:col-span-2">
          <nav className="text-sm text-gray-400 mb-4">
            <Link to="/" className="text-gray-300 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/books" className="text-gray-300 hover:underline">
              <span>Books</span>
            </Link>{" "}
            / <span className="text-amber-50 font-semibold">{book.name}</span>
          </nav>

          <div className="bg-[#1b2e31] rounded-lg p-5 shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex items-start justify-center">
                <img
                  src={`http://localhost:5000/${book.coverPhoto}`}
                  alt={book.imageName}
                  className="w-full md:w-5/6 h-full object-cover rounded-lg border"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[#dbf8fa] mb-2">
                  {book.name}
                </h1>

                <div className="flex items-center gap-8 mb-3">
                  <div className="flex items-center gap-2">
                    {/* <img
                      src={book.favicon}
                      alt="author"
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <p className="text-sm">
                        {book.author?.length > 0 ? book.author[0].name : "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">Author</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Stars value={book.rating} />
                    <span className="text-sm text-gray-300">
                      {book.rating} • {book.reviews} reviews
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Price:</div>
                      <div className="flex items-baseline gap-3">
                        <div className="text-2xl font-bold text-amber-50">
                          {formatCurrency(book.price)}
                        </div>
                        <div className="text-sm line-through text-gray-500">
                          {formatCurrency(book.mrp)}
                        </div>
                        <div className="text-sm text-green-400">
                          ({book.discountPercent}% OFF)
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Inclusive of all taxes
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <FaShippingFast />
                    <div>
                      <div>{book.deliveryEstimate}</div>
                      <div className="text-xs text-gray-500">
                        Free delivery above ₹499
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-700 text-sm text-gray-300">
                    <div className="mb-2">
                      <span className="text-gray-400">Sold by:</span>{" "}
                      <span className="text-amber-200">
                        {book.seller?.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Seller rating: {book.seller?.rating}/5
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{book.description}</p>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-400 mb-2">
                    Product details
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>ISBN: {book.isbn}</li>
                    <li>Publisher: {book.publisher}</li>
                    <li>Pages: {book.pages}</li>
                    <li>Language: {book.language}</li>
                    <li>Dimensions: {book.dimensions}</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm text-gray-400 mb-2">Key features</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* {items.features.map((f, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#0f2a2c] px-3 py-1 rounded-full text-gray-300"
                      >
                        {f}
                      </span>
                    ))} */}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleBuyBook}
                    className="px-4 py-2 bg-amber-400 text-black font-semibold rounded shadow hover:bg-amber-500 transition"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-transparent border border-gray-600 rounded text-gray-300 hover:bg-gray-800"
                  >
                    {CartBtnText}
                  </button>
                  <button className="ml-auto flex items-center gap-2 text-gray-300">
                    <IoMdHeart className="text-2xl  hover:text-red-400 transition" />{" "}
                    Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews preview */}
          <div className="mt-6 bg-[#1b2e31] p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-[#dbf8fa] mb-3">
              Customer reviews
            </h3>
            <div className="flex items-start gap-4">
              <div className="text-4xl font-bold text-amber-300">
                {book.rating}
              </div>
              <div>
                <Stars value={book.rating} />
                <p className="text-sm text-gray-400">
                  {book.reviews} global ratings
                </p>
                <p className="mt-3 text-gray-300">
                  Most buyers recommend this book for nature & photography
                  lovers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
