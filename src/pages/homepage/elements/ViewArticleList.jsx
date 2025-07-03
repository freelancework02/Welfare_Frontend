import React, { useEffect, useState } from 'react';
import Layout from '../../../component/Layout';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const ViewArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:5000/api/articles');
        setArticles(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch articles', 'error');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the article.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      // TODO: Replace with API call to delete article
      setArticles(articles.filter(article => article.ArticleID !== id));
      Swal.fire('Deleted!', 'The article has been deleted.', 'success');
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text, maxLength = 100) => {
    const plainText = stripHtml(text);
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getImageSrc = (imageUrl) => imageUrl || '';

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Articles</h1>
          <a href="/" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">+ Add Article</a>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 border-b text-left">Sr</th>
                <th className="py-3 px-4 border-b text-left">Title</th>
                <th className="py-3 px-4 border-b text-left">Image</th>
                <th className="py-3 px-4 border-b text-left">English Description</th>
                <th className="py-3 px-4 border-b text-left">Urdu Description</th>
                <th className="py-3 px-4 border-b text-left">Writers</th>
                <th className="py-3 px-4 border-b text-left">Translators</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">Loading articles...</td>
                </tr>
              ) : currentArticles.length > 0 ? (
                currentArticles.map((article, index) => (
                  <tr key={article.ArticleID} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{(currentPage - 1) * articlesPerPage + index + 1}</td>
                    <td className="py-3 px-4 border-b">{article.Title}</td>
                    <td className="py-3 px-4 border-b">
                      {article.ThumbnailURL ? (
                        <img src={article.ThumbnailURL} alt={article.Title} className="w-16 h-auto object-cover" />
                      ) : "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b max-w-[200px]">
                      <div className="line-clamp-2">
                        {truncateText(article.ContentEnglish)}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b max-w-[200px]">
                      <div className="line-clamp-2 text-right">
                        {truncateText(article.ContentUrdu)}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b">{article.WriterName}</td>
                    <td className="py-3 px-4 border-b">{article.TranslatorName || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => navigate(`/articles/${article.ArticleID}`)}
                        className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition"
                        title="View Article"
                      >
                        View Article
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstArticle + 1} to {Math.min(indexOfLastArticle, totalArticles)} of {totalArticles} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md border text-sm ${currentPage === number ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewArticleList;