import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ImageIcon,
  Type,
  FileText,
  Users,
  Globe,
  Hash,
} from "lucide-react";
import Layout from "../../../component/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";

// Font registration for Quill
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
  "Aslam",
  "Mehr-Nastaliq",
];
Quill.register(Font, true);

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Quill editor settings
const modules = {
  toolbar: [
    [{ font: Font.whitelist }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
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
  "script",
  "header",
  "align",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "clean",
];

const tagOptions = [
  { label: "Politics", value: "politics" },
  { label: "Technology", value: "technology" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
];

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateArticlePage() {
  const fileInputRef = useRef();
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [articleTitle, setArticleTitle] = useState("");
  const [englishDescription, setEnglishDescription] = useState("");
  const [urduDescription, setUrduDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedWriter, setSelectedWriter] = useState("");
  const [selectedTranslator, setSelectedTranslator] = useState("");
  const [writerDesignation, setWriterDesignation] = useState("");
  const [publicationDate, setPublicationDate] = useState(getCurrentDate());
  const [selectedTags, setSelectedTags] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImageURL(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!articleTitle || !selectedLanguage || !selectedWriter) {
      Swal.fire(
        "Validation Error",
        "Please fill in required fields.",
        "warning"
      );
      return false;
    }
    return true;
  };

  const handleSave = async (isPublish) => {
    if (!validateForm()) return;

    try {
      Swal.fire({
        title: "Processing...",
        text: isPublish ? "Publishing your article..." : "Saving your draft...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const formData = new FormData();

      if (uploadedImageFile) formData.append("image", uploadedImageFile);
      formData.append("title", articleTitle);
      formData.append("englishDescription", englishDescription);
      formData.append("urduDescription", urduDescription);
      formData.append("topic", selectedTopic);
      formData.append("writers", selectedWriter);
      formData.append("writerDesignation", writerDesignation);
      formData.append("language", selectedLanguage);
      formData.append("date", publicationDate);
      formData.append("isPublished", isPublish);
      formData.append("createdAt", new Date().toISOString());

      if (selectedTranslator) formData.append("translator", selectedTranslator);
     if (selectedTags.trim() !== "") {
  selectedTags
    .split(",")
    .map((tag) => tag.trim())
    .forEach((tag) => formData.append("tags[]", tag));
}


      await axios.post("http://localhost:5000/api/postarticle", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        mode: "cors",
      });

      Swal.fire({
        icon: "success",
        title: isPublish ? "Published!" : "Draft Saved!",
        text: isPublish
          ? "Your article has been published."
          : "Your draft has been saved.",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/viewarticle";
      }, 3000);
    } catch (error) {
       console.error("Submission error:", error);

  Swal.fire({
    icon: "error",
    title: "Failed",
    text:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.",
  });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/articles" className="hover:text-foreground">
              Articles
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Article</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8">Create Article</h1>

          <div className="bg-slate-50 rounded-lg p-8">
            {/* Image Upload */}
            <section className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Featured Image
              </label>
              <div className="max-w-md mx-auto">
                <div
                  className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition"
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploadedImageURL ? (
                    <img
                      src={uploadedImageURL}
                      alt="Uploaded Preview"
                      className="w-60 h-60 object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 mb-4 text-muted-foreground">
                        <ImageIcon className="w-full h-full" />
                      </div>
                      <p className="text-base mb-1">
                        Drop your image or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        PNG, JPG, GIF (max 5MB)
                      </p>
                      <button
                        type="button"
                        className="border px-4 py-2 rounded-md text-sm bg-transparent border-gray-400 hover:border-gray-500"
                      >
                        Browse Files
                      </button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side */}
              <div className="lg:col-span-2 space-y-6">
                <Field
                  label="Article Title"
                  icon={<Type className="w-4 h-4" />}
                >
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    required
                  />
                </Field>

                <Field
                  label="English Description"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={englishDescription}
                    onChange={setEnglishDescription}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                  />
                </Field>

                <Field
                  label="Urdu Description"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={urduDescription}
                    onChange={setUrduDescription}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    style={{ direction: "rtl", textAlign: "right" }}
                    placeholder="اردو تفصیل یہاں درج کریں"
                  />
                </Field>
              </div>

              {/* Right Side */}
              <div className="space-y-6">
                <Field label="Topic" icon={<FileText className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  />
                </Field>

                <Field label="Language" icon={<Globe className="w-4 h-4" />}>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                  >
                    <option value="">Select language</option>
                    {["Urdu", "Roman", "English"].map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Writer" icon={<Users className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedWriter}
                    onChange={(e) => setSelectedWriter(e.target.value)}
                  />
                </Field>

                <Field label="Translator" icon={<Users className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedTranslator}
                    onChange={(e) => setSelectedTranslator(e.target.value)}
                  />
                </Field>

                <Field
                  label="Tags (comma-separated)"
                  icon={<Hash className="w-4 h-4" />}
                >
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    placeholder="e.g. politics, technology, health"
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(e.target.value)}
                  />
                </Field>

                <Field
                  label="Publication Date"
                  icon={<CalendarIcon className="w-4 h-4" />}
                >
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleSave(false)}
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={() => handleSave(true)}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
