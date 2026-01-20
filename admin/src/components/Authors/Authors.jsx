import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiUpload } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const [editAuthorId, setEditAuthorId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    info: "",
    books: "",
    coverPhoto: null,
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  const fetchAuthors = async () => {
    try {
      const data = await axios.get("http://localhost:5000/author");
      setAuthors(data.data);
      console.log(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load authors");
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Save edit
  const startEdit = (author) => {
    // console.log(author);

    setEditAuthorId(author._id);
    setEditForm({
      name: author.name,
      info: author.info,
      books: author.books,
      coverPhoto: author.coverPhoto,
    });
  };

  // change Inputs
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    // console.log(editForm);
  };

  // change image
  const handleImageChange = (e) => {
    setEditForm({ ...editForm, coverPhoto: e.target.files[0] });
  };

  const updateAuthorImage = async (id) => {
    try {
      const formData = new FormData();
      console.log(editForm);

      if (editForm.coverPhoto) {
        formData.append("ImageData", editForm.coverPhoto);
      }

      const image = await axios.post(
        `http://localhost:5000/uploadmulter`,
        formData,
      );

      console.log(image);

      await axios.patch(`http://localhost:5000/author/${id}`, {
        name: editForm.name,
        info: editForm.info,
        books: editForm.books,
        coverPhoto: image.data.file,
      });

      fetchAuthors();
      setEditAuthorId(null);
    } catch (error) {
      setError("Failed to update author image");
    }
  };

  // update author
  const updateAuthor = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/author/${id}`, editForm);

      fetchAuthors();
      setEditAuthorId(null);
    } catch (error) {
      console.error(error);
      setError("Failed to update author");
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/author/${id}`);

      fetchAuthors();
    } catch (error) {
      console.error(error);
      setError("Failed to delete author");
    }
  };

  return (
    <div className="p-6 bg-[#0e1a1c] min-h-screen mt-20 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#dbf8fa]">Authors</h2>
        <Link
          to="/add-author"
          className="bg-amber-300 text-[#0e1a1c] px-4 py-2 rounded-lg font-semibold hover:bg-amber-400"
        >
          + Add Author
        </Link>
      </div>

      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-3.5 w-60">
        <p className="text-gray-400 text-sm">Total Authors</p>
        <h3 className="text-2xl font-bold text-[#dbf8fa]">{authors.length}</h3>
      </div>

      {/* Table */}
      <div className="bg-[#1b2e31] border border-[#2c4449] rounded-xl p-4 md:p-6">
        <table className="w-full">
          {/* HEADER */}
          <thead className="hidden md:block">
            <tr className="grid grid-cols-4 text-gray-400 border-b border-[#2c4449]">
              <th className="py-2 px-2 text-left">Name</th>
              <th className="py-2 px-1 text-left">Info</th>
              <th className="py-2 px-2 text-left">Books</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="block md:table-row-group">
            {authors.map((author) => (
              <tr
                key={author._id}
                className="grid grid-cols-1 md:grid-cols-4 items-center border-b border-[#2c4449] px-2 md:px-0 py-3 md:py-0 gap-5"
              >
                {/* NAME */}
                <td className="flex items-center gap-3 py-2">
                  <span className="md:hidden text-gray-400 w-16">Name</span>
                  <img
                    src={`http://localhost:5000/${author.coverPhoto}`}
                    className="w-10 h-10 rounded"
                    alt=""
                  />
                  {editAuthorId === author._id ? (
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      className="border border-[#46666d] rounded px-1 bg-transparent"
                    />
                  ) : (
                    <p className="font-bold text-gray-400">{author.name}</p>
                  )}
                </td>

                {/* INFO */}
                <td className="py-2">
                  <span className="md:hidden text-gray-400">Info</span>
                  {editAuthorId === author._id ? (
                    <input
                      name="info"
                      value={editForm.info}
                      onChange={handleChange}
                      className="border border-[#46666d] rounded px-1 bg-transparent w-full"
                    />
                  ) : (
                    <p className="text-gray-400">{author.info}</p>
                  )}
                </td>

                {/* BOOKS */}
                <td className="py-2">
                  <span className="md:hidden text-gray-400">Books</span>
                  {editAuthorId === author._id ? (
                    <input
                      name="books"
                      value={editForm.books}
                      onChange={handleChange}
                      className="border border-[#46666d] rounded px-1 bg-transparent w-full"
                    />
                  ) : (
                    author.books
                  )}
                </td>

                {/* ACTIONS */}
                <td className="flex gap-3 justify-start md:justify-end py-2">
                  {editAuthorId === author._id ? (
                    <>
                      <label
                        className="cursor-pointer"
                        onChange={handleImageChange}
                        onClick={() => {
                          setSelectedAuthorId(author._id);
                          setShowUploadModal(true);
                        }}
                      >
                        {/* <input type="file" hidden /> */}
                        <FiUpload size={17} className="text-gray-400" />
                      </label>

                      {/* image modal */}
                      {showUploadModal && (
                        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center transition">
                          <div className="bg-white rounded-lg w-[90%] max-w-lg relative">
                            {/* Close */}
                            <button
                              onClick={() => setShowUploadModal(false)}
                              className="absolute top-1 right-1 text-gray-800 text-xl hover:bg-gray-400 px-2 rounded"
                            >
                              ✕
                            </button>

                            {/* Body */}
                            <div className="p-6">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                                <FiUpload
                                  size={48}
                                  className="mx-auto text-gray-400 mb-4"
                                />

                                <p className="font-semibold text-gray-700">
                                  Drag and drop or click here
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  to upload your image (max 2 MB)
                                </p>

                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id="upload-image"
                                  onChange={handleImageChange}
                                />

                                <label
                                  htmlFor="upload-image"
                                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                                >
                                  Choose Image
                                </label>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end gap-3 mt-6">
                                <button
                                  onClick={() => setShowUploadModal(false)}
                                  className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-200"
                                >
                                  Cancel
                                </button>

                                <button
                                  onClick={() => {
                                    updateAuthorImage(selectedAuthorId);
                                    setShowUploadModal(false);
                                  }}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                                >
                                  Upload
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <IoMdCheckmark
                        size={18}
                        className="text-green-500 cursor-pointer"
                        onClick={() => updateAuthor(author._id)}
                      />
                    </>
                  ) : (
                    <FiEdit
                      className="text-blue-400 cursor-pointer"
                      onClick={() => startEdit(author)}
                    />
                  )}

                  <FiTrash2
                    onClick={() => deleteAuthor(author._id)}
                    className="text-red-400 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Authors;
