import React, { useEffect, useState } from 'react';
import Layout from '../../../component/Layout';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

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
      try {
        await deleteDoc(doc(db, "articlePosts", id));
        setArticles(articles.filter(article => article.id !== id));
        Swal.fire('Deleted!', 'The article has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting article:', error);
        Swal.fire('Error', 'Something went wrong!', 'error');
      }
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

  const isArticlePublished = (published) => published === true;

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
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Image</th>
                <th className="py-3 px-4 border-b text-left">English Description</th>
                <th className="py-3 px-4 border-b text-left">Urdu Description</th>
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
                  <td colSpan="12" className="text-center py-6 text-gray-500">Loading articles...</td>
                </tr>
              ) : currentArticles.length > 0 ? (
                currentArticles.map((article, index) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{(currentPage - 1) * articlesPerPage + index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" checked={isArticlePublished(article.published)} readOnly className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="py-3 px-4 border-b">
                      {article.image ? (
                        <img src={getImageSrc(article.image)} alt={article.title} className="w-16 h-auto object-cover" />
                      ) : "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b max-w-[200px]">
                      <div className="line-clamp-2">
                        {truncateText(article?.BlogText?.english)}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b max-w-[200px]">
                      <div className="line-clamp-2 text-right">
                        {truncateText(article?.BlogText?.urdu)}
                      </div>
                    </td>
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
                    <td className="py-3 px-4 border-b space-x-2">
                      <button
                        onClick={() => navigate(`/viewarticle/article/${article.id}`)}
                        className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/edit-article/${article.id}`)}
                        className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-6 text-gray-500">No articles found.</td>
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