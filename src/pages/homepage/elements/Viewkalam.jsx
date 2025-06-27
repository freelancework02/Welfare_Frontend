import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../component/Layout";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import {
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  CalendarDays,
  Globe,
  User,
  Tag,
  Edit,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";

const Viewkalam = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdOn', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastVisible, setLastVisible] = useState(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let q = query(collection(db, 'kalamPosts'), orderBy(sortConfig.key, sortConfig.direction), limit(itemsPerPage));
        
        // Apply status filter if not 'all'
        if (statusFilter !== 'all') {
          q = query(q, where('published', '==', statusFilter === 'published'));
        }

        const querySnapshot = await getDocs(q);
        
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdOn: doc.data().createdOn?.toDate().toLocaleString() || 'N/A',
          modifiedOn: doc.data().modifiedOn?.toDate().toLocaleString() || 'N/A'
        }));
        
        setArticles(articlesData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles: ", error);
        setLoading(false);
      }
    };

    // Fetch total count (this is a separate operation)
    const fetchTotalCount = async () => {
      try {
        let countQuery = query(collection(db, 'kalamPosts'));
        if (statusFilter !== 'all') {
          countQuery = query(countQuery, where('published', '==', statusFilter === 'published'));
        }
        const snapshot = await getDocs(countQuery);
        setTotalArticles(snapshot.size);
      } catch (error) {
        console.error("Error fetching total count: ", error);
      }
    };

    fetchArticles();
    fetchTotalCount();
  }, [sortConfig, statusFilter, currentPage]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const fetchNextPage = async () => {
    if (!lastVisible) return;
    
    try {
      let q = query(
        collection(db, 'kalamPosts'),
        orderBy(sortConfig.key, sortConfig.direction),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
      
      if (statusFilter !== 'all') {
        q = query(q, where('published', '==', statusFilter === 'published'));
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const newArticles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdOn: doc.data().createdOn?.toDate().toLocaleString() || 'N/A',
          modifiedOn: doc.data().modifiedOn?.toDate().toLocaleString() || 'N/A'
        }));
        
        setArticles(newArticles);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching next page: ", error);
    }
  };

  const fetchPrevPage = async () => {
    if (currentPage <= 1) return;
    
    // Note: Firestore doesn't natively support "previous page" with cursors
    // This is a simplified approach - for full pagination you might need to keep track of all cursors
    try {
      let q = query(
        collection(db, 'kalamPosts'),
        orderBy(sortConfig.key, sortConfig.direction),
        limit(itemsPerPage * (currentPage - 1))
      );
      
      if (statusFilter !== 'all') {
        q = query(q, where('published', '==', statusFilter === 'published'));
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.docs.length > 0) {
        const articlesData = querySnapshot.docs
          .slice(-itemsPerPage)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn?.toDate().toLocaleString() || 'N/A',
            modifiedOn: doc.data().modifiedOn?.toDate().toLocaleString() || 'N/A'
          }));
        
        setArticles(articlesData);
        setCurrentPage(prev => prev - 1);
        // Note: This approach doesn't perfectly handle the cursor for previous pages
        // For a complete solution, you'd need to maintain an array of cursors
      }
    } catch (error) {
      console.error("Error fetching previous page: ", error);
    }
  };

  // Client-side filtering for search (since we're only fetching a page at a time)
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.writers.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    article.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            All Kalam
          </h2>

          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    {sortConfig.key === "title" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Writer
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => requestSort("topic")}
                >
                  <div className="flex items-center">
                    Topic
                    {sortConfig.key === "topic" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Language
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdOn")}
                >
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Created On
                    {sortConfig.key === "createdOn" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                +{article.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {article.writers}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {article.topic || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {article.language || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.createdOn}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          article.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-kalam/${article.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/viewkalam/${article.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalArticles > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalArticles)}
              </span>{" "}
              of <span className="font-medium">{totalArticles}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={fetchNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Viewkalam;
