import React, { useState, useEffect } from 'react';
import Layout from '../../../component/Layout';
import { FileText, Search, ChevronUp, ChevronDown, Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const ViewTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch topics', 'error');
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This topic will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      // TODO: Replace with API call to delete topic
      setTopics((prev) => prev.filter((topic) => topic.id !== id));
      Swal.fire('Deleted!', 'Topic has been deleted.', 'success');
    }
  };

  const filteredTopics = topics.filter((topic) =>
    (topic.Title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.CategoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.GroupName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.Slug || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client-side sorting
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTopics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTopics.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Topics</h2>
          <button
            onClick={() => navigate('/topic')}
            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base"
          >
            Add Topic
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search topics..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => requestSort('Title')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Title {sortConfig.key === 'Title' && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</div>
                </th>
                <th onClick={() => requestSort('CategoryName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Category {sortConfig.key === 'CategoryName' && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</div>
                </th>
                <th onClick={() => requestSort('GroupName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Group {sortConfig.key === 'GroupName' && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</div>
                </th>
                <th onClick={() => requestSort('Slug')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Slug {sortConfig.key === 'Slug' && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</div>
                </th>
                <th onClick={() => requestSort('CreatedOn')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Created On {sortConfig.key === 'CreatedOn' && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((topic) => (
                  <tr key={topic.id || topic.TopicID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.Title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.CategoryName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.GroupName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{topic.Slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.CreatedOn || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => navigate(`/topics/${topic.id || topic.TopicID}`)}
                        className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition"
                        title="View Topic"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/viewtopics/edit/${topic.id || topic.TopicID}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id || topic.TopicID)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No topics found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sortedTopics.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, sortedTopics.length)}</span> of <span className="font-medium">{sortedTopics.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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

export default ViewTopics;
