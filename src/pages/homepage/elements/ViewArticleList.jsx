import React, { useEffect, useState } from 'react';
import Layout from '../../../component/Layout';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig";

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
        const q = query(collection(db, 'articlePosts'), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  const isArticlePublished = (published) => published === true;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Articles</h1>
          <div className="flex space-x-2">
            <a href="/" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">+ Add Article</a>
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
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center py-6 text-gray-500">
                    Loading articles...
                  </td>
                </tr>
              ) : currentArticles.length > 0 ? (
                currentArticles.map((article, index) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      {(currentPage - 1) * articlesPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isArticlePublished(article.published)}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="py-3 px-4 border-b">
                      {article.image ? (
                        <img
                          src={getImageSrc(article.image)}
                          alt={article.title}
                          className="w-16 h-auto object-cover"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-4 border-b" dangerouslySetInnerHTML={{ __html: article?.BlogText?.english || "" }} />
                    <td className="py-3 px-4 border-b text-right" dangerouslySetInnerHTML={{ __html: article?.BlogText?.urdu || "" }} />
                    <td className="py-3 px-4 border-b">{article.title}</td>
                    <td className="py-3 px-4 border-b">{article.writers}</td>
                    <td className="py-3 px-4 border-b">{article.translator || "-"}</td>
                    <td className="py-3 px-4 border-b">{article.language}</td>
                    <td className="py-3 px-4 border-b">{article.views || 0}</td>
                    <td className="py-3 px-4 border-b">
                      {article.createdOn?.toDate
                        ? article.createdOn.toDate().toLocaleDateString()
                        : "-"}
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
            Showing {indexOfFirstArticle + 1} to{' '}
            {Math.min(indexOfLastArticle, totalArticles)} of {totalArticles} entries
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
