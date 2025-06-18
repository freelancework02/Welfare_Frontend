import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../component/Layout";

export default function TagList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = () => {
    setLoading(true);
    axios.get("https://newmmdata-backend.onrender.com/api/tags")
      .then((res) => {
        setTags(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tags:", err);
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setTagName("");
    setEditingTagId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tag) => {
    setTagName(tag.tag);
    setEditingTagId(tag.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTagName("");
    setEditingTagId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTagId) {
      axios.put(`https://newmmdata-backend.onrender.com/api/tags/${editingTagId}`, { tag: tagName })
        .then(() => {
          fetchTags();
          closeModal();
        })
        .catch((err) => console.error("Error updating tag:", err));
    } else {
      axios.post("https://newmmdata-backend.onrender.com/api/tags", { tag: tagName })
        .then(() => {
          fetchTags();
          closeModal();
        })
        .catch((err) => console.error("Error creating tag:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      axios.delete(`https://newmmdata-backend.onrender.com/api/tags/${id}`)
        .then(() => fetchTags())
        .catch((err) => console.error("Error deleting tag:", err));
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tags List</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Tag
          </button>
        </div>

        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tag</th>
                  <th className="px-4 py-2 border">Created On</th>
                  <th className="px-4 py-2 border">Modified On</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr key={index} className="text-sm text-gray-700 text-center hover:bg-gray-50">
                    <td className="px-4 py-2 border">{tag.id}</td>
                    <td className="px-4 py-2 border">{tag.tag}</td>
                    <td className="px-4 py-2 border">{new Date(tag.createdOn).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{new Date(tag.modifiedOn).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(tag)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                {editingTagId ? "Edit Tag" : "Add Tag"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter tag name"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {editingTagId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
