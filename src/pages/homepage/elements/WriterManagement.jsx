import { useEffect, useState } from "react";
import Layout from "../../../component/Layout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserPlus, Pencil, Eye, Trash2 } from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function WriterManagement() {
  const [writers, setWriters] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const snapshot = await getDocs(collection(db, "writers"));
        const writerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWriters(writerList);
      } catch (error) {
        console.error("Error fetching writers:", error);
      }
    };

    fetchWriters();
  }, []);

  const handleDeleteWriter = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "writers", id));
        setWriters((prev) => prev.filter((w) => w.id !== id));
        Swal.fire("Deleted!", "Writer has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting writer:", error);
        Swal.fire("Error", `Failed to delete writer. ${error.message}`, "error");
      }
    }
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const filteredWriters = writers.filter((writer) => {
    const name = writer.name?.toLowerCase() || "";
    const designation = writer.designation?.toLowerCase() || "";
    const englishDesc = writer.englishDescription?.toLowerCase() || "";
    const urduDesc = writer.urduDescription?.toLowerCase() || "";

    return (
      name.includes(searchQuery.toLowerCase()) ||
      designation.includes(searchQuery.toLowerCase()) ||
      englishDesc.includes(searchQuery.toLowerCase()) ||
      urduDesc.includes(searchQuery.toLowerCase())
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
            onClick={() => navigate(`/createwriter`)}
            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add New Writer
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
          <table className="w-full min-w-[900px] border border-gray-300">
            <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="text-left p-3 border text-lg">Image</th>
                <th className="text-left p-3 border text-lg">Name</th>
                <th className="text-left p-3 border text-lg">Urdu Description</th>
                <th className="text-left p-3 border text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWriters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No writers found
                  </td>
                </tr>
              ) : (
                paginatedWriters.map((writer) => (
                  <tr key={writer.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border text-lg">
                      <img
                        src={writer.imageURL || "/placeholder.jpg"}
                        alt={writer.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 border text-lg">{writer.writerName}</td>
                   
                   
                    <td
                      className="p-3 border text-lg text-right"
                      title={stripHtml(writer.aboutWriter)}
                    >
                      {stripHtml(writer.aboutWriter).length > 300
                        ? `${stripHtml(writer.aboutWriter).substring(0, 300)}...`
                        : stripHtml(writer.aboutWriter)}
                    </td>
                    <td className="p-3 border text-lg">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/viewwriters/${writer.id}`)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/writers-update/${writer.id}`)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteWriter(writer.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
