import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://welfare-a0jo.onrender.com/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-xl">Loading blog post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
            <button 
              onClick={() => navigate("/")} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md mb-6 transition-colors flex items-center"
        >
          <span className="mr-1">&larr;</span> Back
        </button>
        
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          <header className="p-6 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                {blog.topic}
              </span>
              <span className="flex items-center">
                By {blog.writername}
              </span>
              <span className="flex items-center">
                {formatDate(blog.created_at)}
              </span>
            </div>
          </header>

          <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden">
            {!imageError ? (
              <img 
                src={`https://welfare-a0jo.onrender.com/api/blogs/${blog.id}/image?t=${new Date().getTime()}`} 
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>

          <div 
            className="p-6 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          <footer className="p-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => navigate(`/editblog/${blog.id}`)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
            >
              Edit Post
            </button>
          </footer>
        </article>
      </div>
    </Layout>
  );
};

export default BlogView;