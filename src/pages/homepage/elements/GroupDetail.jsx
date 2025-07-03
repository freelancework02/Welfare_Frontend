import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
        setGroup(response.data);
      } catch (err) {
        setError("Failed to fetch group");
        Swal.fire("Error", "Failed to fetch group", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
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

  if (!group) return null;

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
        <h1 className="text-3xl font-bold mb-2 text-center">{group.GroupName}</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="prose max-w-none border rounded p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: group.GroupDescription || '<em>No description</em>' }} />
        </div>
      </div>
    </Layout>
  );
} 