import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Type,
  Tag,
  User,
  FileText,
  Plus,
  Loader,
  List
} from "lucide-react";
import CreatableSelect from "react-select/creatable";

// Quill Fonts
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

// Inject Font Styles
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri&family=Rubik:wght@300;700&family=Scheherazade+New:wght@400;700&display=swap');
  
  .ql-font-sans-serif { font-family: sans-serif; }
  .ql-font-serif { font-family: serif; }
  .ql-font-monospace { font-family: monospace; }
  .ql-font-Amiri { font-family: 'Amiri', serif; }
  .ql-font-Rubik-Bold { font-family: 'Rubik', sans-serif; font-weight: 700; }
  .ql-font-Rubik-Light { font-family: 'Rubik', sans-serif; font-weight: 300; }
  .ql-font-Scheherazade-Regular { font-family: 'Scheherazade New', serif; font-weight: 400; }
  .ql-font-Scheherazade-Bold { font-family: 'Scheherazade New', serif; font-weight: 700; }
`;
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

// Quill Config
const modules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ size: ["small", false, "large", "huge"] }],
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
  const [category, setCategory] = useState("");
  const [writername, setWriterName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // Fetch available topics & categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, categoryRes] = await Promise.all([
          fetch("https://welfare-a0jo.onrender.com/api/topics"),
          fetch("https://welfare-a0jo.onrender.com/api/categories"),
        ]);
        const topicsData = await topicRes.json();
        const categoriesData = await categoryRes.json();

        setTopics(topicsData.map((t) => ({ value: t.title, label: t.title })));
        setCategories(
          categoriesData.map((c) => ({ value: c.title, label: c.title }))
        );
      } catch (err) {
        console.error("Error fetching topics/categories:", err);
      }
    };
    fetchData();
  }, []);

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Submit
  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !topic.trim() ||
      !category.trim() ||
      !writername.trim() ||
      !description.trim()
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }
    if (!image) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Image",
        text: "Please select a blog image.",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("category", category);
      formData.append("writername", writername);
      formData.append("description", description);
      formData.append("image", image);

      const response = await fetch(
        "https://welfare-a0jo.onrender.com/api/blogs",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to create blog");

      Swal.fire({
        icon: "success",
        title: "Blog Created Successfully!",
        timer: 2000,
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
      setTimeout(() => navigate("/viewblog"), 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg mr-4 transition-all shadow-sm hover:shadow-md flex items-center group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Plus className="w-8 h-8 mr-3 text-indigo-600" />
            Create New Blog
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <Type className="w-4 h-4 mr-2 text-indigo-600" />
                Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                Topic <span className="text-red-500 ml-1">*</span>
              </label>
              <CreatableSelect
                isClearable
                isDisabled={isSubmitting}
                options={topics}
                onChange={(val) => setTopic(val ? val.value : "")}
                onCreateOption={(val) => setTopic(val)}
                placeholder="Select or type a topic"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <List className="w-4 h-4 mr-2 text-indigo-600" />
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <CreatableSelect
                isClearable
                isDisabled={isSubmitting}
                options={categories}
                onChange={(val) => setCategory(val ? val.value : "")}
                onCreateOption={(val) => setCategory(val)}
                placeholder="Select or type a category"
              />
            </div>

            {/* Writer Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Writer Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter writer's name"
                value={writername}
                onChange={(e) => setWriterName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <ReactQuill
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                readOnly={isSubmitting}
                theme="snow"
                className="bg-white dark:bg-gray-700 h-72"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <ImageIcon className="w-4 h-4 mr-2 text-indigo-600" />
                Blog Image <span className="text-red-500 ml-1">*</span>
              </label>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-indigo-300"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-md flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Blog
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateBlog;
