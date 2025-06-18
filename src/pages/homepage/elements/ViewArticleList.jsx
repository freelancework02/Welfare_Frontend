import React, { useEffect, useState } from 'react';
import Layout from '../../../component/Layout';
import { useNavigate } from 'react-router-dom';

const ViewArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/newarticle`);
        const data = await response.json();
        console.log('DATA:', data);
        setArticles(data.articles || data || []);
        setTotalArticles(data.totalCount || data.length || 0);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, articlesPerPage]);

  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const isArticlePublished = (isPublished) => {
    return isPublished === 1;
  };

  const getImageSrc = (image) => {
  if (image?.data) {
    const byteArray = new Uint8Array(image.data);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob); // returns a local blob URL
  }
  return '';
};

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Articles</h1>
          <div className="flex space-x-2">
            <a href="/article" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">+ Add Article</a>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-md text-sm">Reset</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">Recycle Bin</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 border-b text-left">Sr</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Image</th>
                <th className="py-3 px-4 border-b text-left w-[400px]">English Description</th>
                <th className="py-3 px-4 border-b text-left w-[400px]">Urdu Description</th>
                <th className="py-3 px-4 border-b text-left">Title</th>
                <th className="py-3 px-4 border-b text-left">Writers</th>
                <th className="py-3 px-4 border-b text-left">Translators</th>
                <th className="py-3 px-4 border-b text-left">Language</th>
                <th className="py-3 px-4 border-b text-left">Views</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      {(currentPage - 1) * articlesPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isArticlePublished(article.isPublished)}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="py-3 px-4 border-b">
                      <img
                        src={getImageSrc(article.image)}
                        alt={article.title}
                        className="w-16 h-auto object-cover"
                      />
                    </td>
                    <td
                      className="py-3 px-4 border-b"
                      dangerouslySetInnerHTML={{ __html: article.englishDescription }}
                    />
                    <td
                      className="py-3 px-4 border-b text-right"
                      dangerouslySetInnerHTML={{ __html: article.urduDescription }}
                    />
                    <td className="py-3 px-4 border-b">{article.title}</td>
                    <td className="py-3 px-4 border-b">{article.writers}</td>
                    <td className="py-3 px-4 border-b">{article.translator}</td>
                    <td className="py-3 px-4 border-b">{article.language}</td>
                    <td className="py-3 px-4 border-b">{article.views}</td>
                    <td className="py-3 px-4 border-b">
                      {new Date(article.createdOn).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => navigate(`/viewarticle/article/${article.id}`)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-6 text-gray-500">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * articlesPerPage + 1} to{' '}
            {Math.min(currentPage * articlesPerPage, totalArticles)} of {totalArticles} entries
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
