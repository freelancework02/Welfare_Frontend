import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/${id}`);
        setCategory(response.data);
      } catch (err) {
        setError("Failed to fetch category");
        Swal.fire("Error", "Failed to fetch category", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </Layout>
    );
  }

  if (!category) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-2 text-center">{category.Name}</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-600 text-sm">
          <span>Slug: <span className="font-semibold">{category.Slug || '-'}</span></span>
          {category.GroupName && <span>Group: <span className="font-semibold">{category.GroupName}</span></span>}
          {category.Color && <span>Color: <span className="inline-block w-6 h-6 rounded-full border align-middle" style={{ backgroundColor: category.Color }} title={category.Color}></span></span>}
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="prose max-w-none border rounded p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: category.Description || '<em>No description</em>' }} />
        </div>
      </div>
    </Layout>
  );
} 