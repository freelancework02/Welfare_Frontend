import React, { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";

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

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [writername, setWriterName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

 const handleImageChange = (e) => {
  if (e.target.files && e.target.files) {
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
    if (!image) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Image",
        text: "Please select a blog image.",
      });
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("writername", writername);
      formData.append("description", description);
      formData.append("image", image);

      const response = await fetch("https://welfare-a0jo.onrender.com/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create blog");

      Swal.fire({ icon: "success", title: "Blog Created", timer: 2000 });
      setTimeout(() => navigate("/"), 1500);
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">✍️ Create Blog</h1>
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
              Blog Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="block w-full"
            />
            {image && (
              <div className="mt-2 text-sm text-gray-500">
                Selected: {image.name}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-all ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateBlog;
