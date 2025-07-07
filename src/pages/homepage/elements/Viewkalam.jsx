import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import {
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  CalendarDays,
  Globe,
  User,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Viewkalam = () => {
  const [kalaams, setKalaams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "Title", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKalaams = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get("https://updated-naatacademy.onrender.com/api/kalaam");
        setKalaams(response.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch kalaams", "error");
        setKalaams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchKalaams();
  }, []);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Client-side filtering for search
  const filteredKalaams = kalaams.filter((kalaam) =>
    (kalaam.Title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kalaam.WriterName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kalaam.CategoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kalaam.GroupName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client-side sorting
  const sortedKalaams = [...filteredKalaams].sort((a, b) => {
    if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedKalaams.length / itemsPerPage);
  const currentItems = sortedKalaams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const fetchPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
            All Kalaam
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/kalam')}
              className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base"
            >
              Add Kalam
            </button>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search kalaam..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("Title")}
                >
                  <div className="flex items-center">
                    Title
                    {sortConfig.key === "Title" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("WriterName")}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Writer
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("CategoryName")}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === "CategoryName" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("GroupName")}
                >
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Group
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("CreatedOn")}
                >
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Created On
                    {sortConfig.key === "CreatedOn" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((kalaam) => (
                  <tr key={kalaam.KalaamID} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{kalaam.Title}</td>
                    <td className="px-6 py-4">{kalaam.WriterName}</td>
                    <td className="px-6 py-4">{kalaam.CategoryName}</td>
                    <td className="px-6 py-4">{kalaam.GroupName}</td>
                    <td className="px-6 py-4">{kalaam.CreatedOn || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => navigate(`/kalaam/${kalaam.KalaamID}`)}
                        className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition flex items-center gap-1"
                        title="View Kalam"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/kalaam/${kalaam.KalaamID}/edit`)}
                        className="text-yellow-600 hover:text-yellow-900 border border-yellow-600 px-3 py-1 rounded transition flex items-center gap-1"
                        title="Edit Kalam"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Are you sure?',
                            text: "You won't be able to revert this!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete it!'
                          });

                          if (result.isConfirmed) {
                            try {
                              const response = await axios.delete(`https://updated-naatacademy.onrender.com/api/kalaam/${kalaam.KalaamID}`);
                              
                              if (response.data.success) {
                                Swal.fire('Deleted!', 'Kalaam has been deleted.', 'success');
                                // Refresh the list
                                const updatedResponse = await axios.get("https://updated-naatacademy.onrender.com/api/kalaam");
                                setKalaams(updatedResponse.data);
                              } else {
                                throw new Error(response.data.message || 'Failed to delete');
                              }
                            } catch (error) {
                              Swal.fire('Error', error.message || 'Failed to delete kalaam', 'error');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded transition flex items-center gap-1"
                        title="Delete Kalam"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No kalaam found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedKalaams.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing { (currentPage - 1) * itemsPerPage + 1 } to { Math.min(currentPage * itemsPerPage, sortedKalaams.length) } of <span className="font-medium">{sortedKalaams.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={fetchPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${ currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600" }`}
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={fetchNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${ currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600" }`}
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
