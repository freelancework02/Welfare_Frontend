import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import axios from "axios";

export default function ViewWriter() {
  const { id } = useParams();
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWriter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://updated-naatacademy.onrender.com/api/writers/${id}`);
        setWriter(response.data);
      } catch (err) {
        setError("Failed to fetch writer");
        Swal.fire("Error", "Failed to fetch writer", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchWriter();
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

  if (!writer) return null;

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
        <div className="flex flex-col items-center mb-6">
          {writer.ProfileImageURL && (
            <img
              src={writer.ProfileImageURL}
              alt={writer.Name}
              className="w-32 h-32 rounded-full object-cover border-2 border-blue-400 mb-2"
            />
          )}
          <h1 className="text-3xl font-bold mb-2 text-center">{writer.Name}</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-600 text-sm">
          <span>Language: <span className="font-semibold">{writer.LanguageName || '-'}</span></span>
          {writer.GroupName && <span>Group: <span className="font-semibold">{writer.GroupName}</span></span>}
          {writer.SectionName && <span>Section: <span className="font-semibold">{writer.SectionName}</span></span>}
          <span>Status: <span className="font-semibold">{writer.Status || '-'}</span></span>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <div className="prose max-w-none border rounded p-4 bg-gray-50" dangerouslySetInnerHTML={{ __html: writer.Bio || '<em>No bio</em>' }} />
        </div>
      </div>
    </Layout>
  );
}