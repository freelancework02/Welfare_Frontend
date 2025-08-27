import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import axios from "axios";

const Font = Quill.import("formats/font");
Font.whitelist = [
  "sans-serif",
  "serif",
  "monospace",
  "Amiri",
  "Rubik-Bold",
  "Rubik-Light",
  "Scheherazade-Regular",
  "Scheherazade-Bold",
];
Quill.register(Font, true);

const modules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "header",
  "list",
  "bullet",
  "align",
  "link",
  "image",
];

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [writername, setWriterName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`https://welfare-a0jo.onrender.com/api/blogs/${id}`);
      const blog = response.data;
      setTitle(blog.title);
      setTopic(blog.topic);
      setWriterName(blog.writername);
      setDescription(blog.description);
      
      // Get the image URL
      if (blog.id) {
        setCurrentImage(`https://welfare-a0jo.onrender.com/api/blogs/${blog.id}/image`);
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load blog data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !topic.trim() || !writername.trim() || !description.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in title, topic, writer name and description.",
      });
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("writername", writername);
      formData.append("description", description);
      
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(`https://welfare-a0jo.onrender.com/api/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        Swal.fire({ 
          icon: "success", 
          title: "Blog Updated", 
          timer: 2000 
        });
        setTimeout(() => navigate("/viewblog"), 1500);
      } else {
        throw new Error("Failed to update blog");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-10 px-4">
          <p className="text-gray-600 text-center">Loading blog data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">✍️ Edit Blog</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter blog topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Writer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter writer's name"
              value={writername}
              onChange={(e) => setWriterName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              className="bg-white"
              readOnly={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Blog Image
            </label>
            {currentImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img 
                  src={currentImage} 
                  alt="Current blog" 
                  className="h-40 object-cover rounded-md"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="block w-full"
            />
            {image && (
              <div className="mt-2 text-sm text-gray-500">
                New image selected: {image.name}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/viewblog')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-all ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBlog;