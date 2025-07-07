import { useEffect, useState } from "react";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WriterManagement() {
  const [writers, setWriters] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWriters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://updated-naatacademy.onrender.com/api/writers");
      setWriters(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch writers", "error");
      setWriters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWriters();
  }, []);

  const handleDelete = async (writerId) => {
    try {
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
        await axios.delete(`https://updated-naatacademy.onrender.com/api/writers/${writerId}`);
        await Swal.fire(
          'Deleted!',
          'Writer has been deleted.',
          'success'
        );
        fetchWriters(); // Refresh the list
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Failed to delete the writer.',
        'error'
      );
    }
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const filteredWriters = writers.filter((writer) => {
    const name = writer.Name?.toLowerCase() || "";
    const bio = stripHtml(writer.Bio)?.toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      bio.includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredWriters.length / pageSize);
  const paginatedWriters = filteredWriters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">Writer Management</h2>
          <button
            onClick={() => navigate('/addwriter')}
            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base"
          >
            Add writer
          </button>
        </div>

        {/* Search & Page size */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="font-medium">Show:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 rounded focus:outline-none focus:ring"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Search writer..."
            className="border px-3 py-1 rounded w-full sm:w-64 focus:outline-none focus:ring"
            style={{ borderColor: '#5a6c17' }}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="w-full min-w-[600px] border border-gray-300">
              <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="text-left p-3 border text-lg">Image</th>
                  <th className="text-left p-3 border text-lg">Name</th>
                  <th className="text-left p-3 border text-lg">Bio</th>
                  <th className="text-left p-3 border text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWriters.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No writers found
                    </td>
                  </tr>
                ) : (
                  paginatedWriters.map((writer) => (
                    <tr key={writer.WriterID} className="border-t hover:bg-gray-50">
                      <td className="p-3 border text-lg">
                        <img
                          src={writer.ProfileImageURL || "/placeholder.jpg"}
                          alt={writer.Name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 border text-lg">{writer.Name}</td>
                      <td className="p-3 border text-lg text-right" title={stripHtml(writer.Bio)}>
                        {stripHtml(writer.Bio).length > 300
                          ? `${stripHtml(writer.Bio).substring(0, 300)}...`
                          : stripHtml(writer.Bio)}
                      </td>
                      <td className="p-3 border text-lg whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/writers/${writer.WriterID}`)}
                          className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition"
                          title="View Writer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/writers/edit/${writer.WriterID}`)}
                          className="text-green-600 hover:text-green-900 border border-green-600 px-3 py-1 rounded transition"
                          title="Edit Writer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(writer.WriterID)}
                          className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded transition"
                          title="Delete Writer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredWriters.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredWriters.length)} of {filteredWriters.length}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">«</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">‹</button>
            <span className="px-3 text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">›</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">»</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
