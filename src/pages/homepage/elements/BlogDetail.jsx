import React, { useState } from "react";
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
  Loader
} from "lucide-react";

// Import font faces
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

// Add font styles to document head
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

// Inject font styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const modules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ size: ['small', false, 'large', 'huge'] }],
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
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !topic.trim() || !writername.trim() || !description.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in title, topic, writer name and description.",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    }
    if (!image) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Image",
        text: "Please select a blog image.",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
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

      Swal.fire({ 
        icon: "success", 
        title: "Blog Created Successfully!", 
        timer: 2000,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
      setTimeout(() => navigate("/viewblog"), 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
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

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            {['Details', 'Content', 'Image', 'Publish'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index < 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index < 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${index < 2 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <FileText className="w-6 h-6 mr-2 text-indigo-600" />
              Blog Details
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the details for your new blog post</p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <Type className="w-4 h-4 mr-2 text-indigo-600" />
                  Title <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                  Topic <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter blog topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Writer Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                placeholder="Enter writer's name"
                value={writername}
                onChange={(e) => setWriterName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="border border-gray-200  text-white dark:border-gray-600 rounded-lg overflow-hidden h-96 mb-12">
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  className="h-72 bg-white dark:bg-gray-700"
                  readOnly={isSubmitting}
                  theme="snow"
                  style={{ 
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white dark:text-white flex items-center">
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
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
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

          {/* Form Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </Layout>
  );
};

export default CreateBlog;