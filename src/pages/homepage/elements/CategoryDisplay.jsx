import React, { useEffect, useState } from "react";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CategoryDisplay() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://updated-naatacademy.onrender.com/api/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories");
      Swal.fire("Error", "Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
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
        await axios.delete(`https://updated-naatacademy.onrender.com/api/categories/${categoryId}`);
        await Swal.fire(
          'Deleted!',
          'Category has been deleted.',
          'success'
        );
        fetchCategories(); // Refresh the list
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'Failed to delete the category.',
        'error'
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">Categories</h2>
          <button
            onClick={() => navigate('/category')}
            className="bg-[#5a6c17] hover:bg-[rgba(90,108,23,0.83)] text-white font-medium px-4 py-2 rounded-lg transition-all text-sm md:text-base"
          >
            Add Category
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.CategoryID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{cat.Name}</td>
                      <td className="px-6 py-4">{cat.Slug}</td>
                      <td className="px-6 py-4">
                        {cat.Color ? (
                          <span className="inline-block w-6 h-6 rounded-full border" style={{ backgroundColor: cat.Color }} title={cat.Color}></span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{cat.GroupName || '-'}</td>
                      <td className="px-6 py-4">{cat.Description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => navigate(`/categories/${cat.CategoryID}`)}
                          className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded transition"
                          title="View Category"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/categories/edit/${cat.CategoryID}`)}
                          className="text-green-600 hover:text-green-900 border border-green-600 px-3 py-1 rounded transition"
                          title="Edit Category"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.CategoryID)}
                          className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded transition"
                          title="Delete Category"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
} 