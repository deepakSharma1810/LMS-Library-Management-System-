// import React, { useState, useEffect } from "react";
// import { Document, Page } from "react-pdf";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const BookReaderPage = () => {
//   const { id } = useParams();

//   const [book, setBook] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   // 🔥 Fetch book
//   useEffect(() => {
//     const fetchBook = async () => {
//       const res = await axios.get(`http://localhost:5000/book/${id}`);
//       setBook(res.data.getBook);

//       // Load last page from localStorage
//       const savedPage = localStorage.getItem(`progress-${id}`);
//       if (savedPage) setPageNumber(Number(savedPage));
//     };

//     fetchBook();
//   }, [id]);

//   // ✅ Save progress
//   useEffect(() => {
//     localStorage.setItem(`progress-${id}`, pageNumber);
//   }, [pageNumber]);

//   if (!book) return <p className="text-white">Loading...</p>;

//   const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-[#0e1a1c] text-white p-6">
//       <h2 className="text-xl mb-3">{book.name}</h2>

//       {/* Progress */}
//       <div className="mb-4">
//         <p className="text-sm text-gray-400">Progress: {progress}%</p>
//         <div className="w-full bg-gray-700 h-2 rounded">
//           <div
//             className="bg-amber-400 h-2 rounded"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>

//       {/* PDF Viewer */}
//       <div className="flex justify-center">
//         <Document
//           file={`http://localhost:5000/${book.actualPdf}`}
//           onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//         >
//           <Page pageNumber={pageNumber} />
//         </Document>
//       </div>

//       {/* Controls */}
//       <div className="flex justify-center gap-4 mt-4">
//         <button
//           disabled={pageNumber <= 1}
//           onClick={() => setPageNumber(pageNumber - 1)}
//           className="px-4 py-2 bg-gray-700 rounded"
//         >
//           Prev
//         </button>

//         <span>
//           Page {pageNumber} of {numPages}
//         </span>

//         <button
//           disabled={pageNumber >= numPages}
//           onClick={() => setPageNumber(pageNumber + 1)}
//           className="px-4 py-2 bg-gray-700 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookReaderPage;

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// 👇 Required for PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BookReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // ✅ Check purchase + fetch book
  useEffect(() => {
    const purchased = JSON.parse(localStorage.getItem("purchased")) || [];

    if (!purchased.includes(id)) {
      alert("Please purchase this book first 📚");
      navigate("/");
      return;
    }

    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/book/${id}`);
        setBook(res.data.getBook);

        // Load saved progress
        const savedPage = localStorage.getItem(`progress-${id}`);
        if (savedPage) setPageNumber(Number(savedPage));
      } catch (err) {
        console.log(err);
      }
    };

    fetchBook();
  }, [id, navigate]);

  // ✅ Save progress
  useEffect(() => {
    localStorage.setItem(`progress-${id}`, pageNumber);
  }, [pageNumber, id]);

  if (!book) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-[#0e1a1c]">
        Loading Book...
      </div>
    );
  }

  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0e1a1c] text-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-4 text-[#dbf8fa]">{book.name}</h1>

        {/* Progress */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Progress: {progress}%</p>
          <div className="w-full bg-gray-700 h-2 rounded">
            <div
              className="bg-amber-400 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex justify-center bg-[#122125] p-4 rounded">
          <Document
            file={`http://localhost:5000/${book.actualPdf}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {pageNumber} / {numPages}
          </span>

          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReaderPage;
