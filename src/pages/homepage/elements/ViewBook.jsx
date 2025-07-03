import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://updated-naatacademy.onrender.com/api/books");
        setBooks(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch books", "error");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">Books List</h2>
          <button
            onClick={() => navigate('/addbook')}
            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base"
          >
            Add Book
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Cover</th>
                  <th className="py-3 px-4 border-b text-left">Title</th>
                  <th className="py-3 px-4 border-b text-left">Author</th>
                  <th className="py-3 px-4 border-b text-left">Language</th>
                  <th className="py-3 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.BookID} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">
                        {book.CoverImageURL ? (
                          <img
                            src={book.CoverImageURL}
                            alt={book.Title}
                            className="w-20 h-28 object-cover rounded shadow"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b font-semibold">{book.Title}</td>
                      <td className="py-3 px-4 border-b">{book.AuthorName}</td>
                      <td className="py-3 px-4 border-b">{book.LanguageName}</td>
                      <td className="py-3 px-4 border-b whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/books/${book.BookID}`)}
                          className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition"
                          title="View Book"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
