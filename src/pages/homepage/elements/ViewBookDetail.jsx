import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";

export default function ViewBookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://updated-naatacademy.onrender.com/api/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError("Failed to fetch book");
        Swal.fire("Error", "Failed to fetch book", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </Layout>
    );
  }

  if (!book) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2 text-center">{book.Title}</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-600 text-sm">
          <span>Author: <span className="font-semibold">{book.AuthorName || '-'}</span></span>
          <span>Language: <span className="font-semibold">{book.LanguageName || '-'}</span></span>
          {book.GroupName && <span>Group: <span className="font-semibold">{book.GroupName}</span></span>}
          {book.SectionName && <span>Section: <span className="font-semibold">{book.SectionName}</span></span>}
        </div>
        {book.CoverImageURL && (
          <div className="flex justify-center mb-6">
            <img
              src={book.CoverImageURL}
              alt={book.Title}
              className="rounded shadow max-h-72 object-contain"
            />
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="prose max-w-none border rounded p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: book.Description || '<em>No description</em>' }} />
        </div>
        <div className="text-right text-gray-500 text-xs mt-8">
          Created On: {book.CreatedOn ? new Date(book.CreatedOn).toLocaleString() : '-'}
        </div>
      </div>
    </Layout>
  );
}
