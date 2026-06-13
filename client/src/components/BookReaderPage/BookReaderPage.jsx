import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../Constant";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const BookReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOK =================
  const fetchBook = async () => {
    try {
      const res = await axios.get(`${API_URL}/book/${id}`);

      setBook(res.data.getBook);
      console.log(res.data.getBook);

      // saved progress
      const savedPage = localStorage.getItem(`progress-${id}`);

      if (savedPage) {
        setPageNumber(Number(savedPage));
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id, navigate]);

  // ================= SAVE PROGRESS =================
  useEffect(() => {
    localStorage.setItem(`progress-${id}`, pageNumber);
  }, [pageNumber, id]);

  // ================= KEYBOARD SUPPORT =================
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" && pageNumber < numPages) {
        setPageNumber((p) => p + 1);
      }

      if (e.key === "ArrowLeft" && pageNumber > 1) {
        setPageNumber((p) => p - 1);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [pageNumber, numPages]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#081013] flex justify-center items-center text-white text-xl">
        Loading Book...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#081013] flex justify-center items-center text-red-400">
        Book Not Found
      </div>
    );
  }

  const progress = numPages ? Math.round((pageNumber / numPages) * 100) : 0;

  const pdfUrl = `${API_URL}/${book.actualPdf.replace(/\\/g, "/")}`;

  // console.log(pdfUrl);

  return (
    <div className="min-h-screen bg-[#081013] text-white px-3 py-5">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
          <div>
            <h1 className="text-3xl font-bold text-[#dbf8fa]">{book.name}</h1>

            <p className="text-gray-400 text-sm mt-1">
              Page {pageNumber} of {numPages}
            </p>
          </div>

          {/* TOOLS */}
          <div className="flex gap-3 flex-wrap">
            {/* Zoom Out */}
            <button
              onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.6))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              -
            </button>

            {/* Zoom In */}
            <button
              onClick={() => setScale((prev) => prev + 0.2)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              +
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded"
            >
              Fullscreen
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-5">
          <div className="flex justify-between mb-1 text-sm text-gray-400">
            <span>Reading Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* PDF VIEWER */}
        <div className="bg-[#122125] rounded-xl p-4 flex justify-center overflow-auto shadow-lg">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<p className="text-white text-lg">Loading PDF...</p>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
          {/* Prev */}
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Input */}
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const value = Number(e.target.value);

              if (value >= 1 && value <= numPages) {
                setPageNumber(value);
              }
            }}
            className="w-20 text-center bg-[#1c2e33] border border-gray-600 rounded px-2 py-2 outline-none"
          />

          {/* Next */}
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookReaderPage;
