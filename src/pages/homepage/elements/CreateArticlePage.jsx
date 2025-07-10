import React from 'react';
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ImageIcon,
  Type,
  FileText,
  Users,
  Globe,
  Hash,
  Layers,
  Grid,
} from "lucide-react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import Layout from '../../../component/Layout';

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

function Field({ label, icon, children, required }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const CreateArticlePage = () => {
  const [title, setTitle] = useState("");
  const [writerId, setWriterId] = useState("");
  const [writerName, setWriterName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [contentUrdu, setContentUrdu] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [writers, setWriters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch writers
    axios.get("https://updated-naatacademy.onrender.com/api/writers")
      .then(res => setWriters(res.data))
      .catch(err => {
        console.error("Error fetching writers:", err);
        setWriters([]);
      });

    // Fetch categories
    axios.get("https://updated-naatacademy.onrender.com/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });

    // Fetch groups
    axios.get("https://updated-naatacademy.onrender.com/api/groups")
      .then(res => setGroups(res.data))
      .catch(err => {
        console.error("Error fetching groups:", err);
        setGroups([]);
      });

    // Fetch sections
    axios.get("https://updated-naatacademy.onrender.com/api/sections")
      .then(res => setSections(res.data))
      .catch(err => {
        console.error("Error fetching sections:", err);
        setSections([]);
      });

    // Fetch topics
    axios.get("https://updated-naatacademy.onrender.com/api/topics")
      .then(res => setTopics(res.data))
      .catch(err => {
        console.error("Error fetching topics:", err);
        setTopics([]);
      });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload only image files (JPEG, JPG, PNG, GIF)",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setImageFile(file);
    const previewURL = URL.createObjectURL(file);
    setThumbnailURL(previewURL);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const requiredFields = { Title: title.trim(), WriterID: writerId, CategoryID: categoryId };
    const missingFields = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);
    if (missingFields.length > 0) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: `Missing: ${missingFields.join(', ')}` });
      return setIsSubmitting(false);
    }

    let finalThumbnailURL = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const res = await axios.post('https://updated-naatacademy.onrender.com/api/upload', formData);
        finalThumbnailURL = res.data.imageUrl;
      } catch {
        Swal.fire({ icon: "error", title: "Upload Failed", text: "Try again." });
        return setIsSubmitting(false);
      }
    }

    try {
      const articleRes = await axios.post('https://updated-naatacademy.onrender.com/api/articles', {
        Title: title,
        WriterID: parseInt(writerId),
        WriterName: writerName,
        CategoryID: parseInt(categoryId),
        CategoryName: categoryName,
        ContentUrdu: contentUrdu,
        ContentEnglish: contentEnglish,
        GroupID: groupId ? parseInt(groupId) : null,
        GroupName: groupName,
        SectionID: sectionId ? parseInt(sectionId) : null,
        SectionName: sectionName,
        Topic: topicName,
        TopicName: topicName,
        IsDeleted: 0,
        ThumbnailURL: finalThumbnailURL // initially temp
      });

      const articleId = articleRes.data.article.ArticleID;
      const fullUrl = `https://updated-naatacademy.onrender.com/api/uploads/${articleId}`;

      await axios.put(`https://updated-naatacademy.onrender.com/api/articles/${articleId}`, {
        ...articleRes.data.article,
        ThumbnailURL: fullUrl
      });

      Swal.fire({ icon: "success", title: "Success", text: "Article created!", timer: 2000 });
      setTimeout(() => navigate("/viewarticle"), 2000);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || 'Creation failed' });
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/viewarticle" className="hover:text-foreground">
              Articles
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Article</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8">Create Article</h1>

          <div className="bg-slate-50 rounded-lg p-8">
            <section className="mb-6">
              <Field label="Thumbnail Image" icon={<ImageIcon className="w-4 h-4" />}>
                <div className="max-w-md">
                  <div
                    className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {thumbnailURL ? (
                      <img
                        src={thumbnailURL}
                        alt="Thumbnail Preview"
                        className="w-60 h-60 object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <div className="w-16 h-16 mb-4 text-muted-foreground">
                          <ImageIcon className="w-full h-full" />
                        </div>
                        <p className="text-base mb-1">Drop your image or click to browse</p>
                        <p className="text-sm text-muted-foreground mb-4">PNG, JPG, GIF (max 5MB)</p>
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
              </Field>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Field
                  label="Article Title"
                  icon={<Type className="w-4 h-4" />}
                  required
                >
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="English Content"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={contentEnglish}
                    onChange={setContentEnglish}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    readOnly={isSubmitting}
                  />
                </Field>

                <Field
                  label="Urdu Content"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={contentUrdu}
                    onChange={setContentUrdu}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    style={{ direction: "rtl", textAlign: "right" }}
                    readOnly={isSubmitting}
                  />
                </Field>
              </div>

              <div className="space-y-6">
                <Field
                  label="Writer"
                  icon={<Users className="w-4 h-4" />}
                  required
                >
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={writerId}
                    onChange={e => {
                      setWriterId(e.target.value);
                      const selected = writers.find(w => String(w.WriterID) === e.target.value);
                      setWriterName(selected ? selected.Name : "");
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Writer</option>
                    {writers.map(writer => (
                      <option key={writer.WriterID} value={writer.WriterID}>
                        {writer.Name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Category"
                  icon={<Grid className="w-4 h-4" />}
                  required
                >
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={categoryId}
                    onChange={e => {
                      setCategoryId(e.target.value);
                      const selected = categories.find(c => String(c.CategoryID) === e.target.value);
                      setCategoryName(selected ? selected.Name : "");
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.CategoryID} value={category.CategoryID}>
                        {category.Name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Group"
                  icon={<Layers className="w-4 h-4" />}
                >
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={groupId}
                    onChange={e => {
                      setGroupId(e.target.value);
                      const selected = groups.find(g => String(g.GroupID) === e.target.value);
                      setGroupName(selected ? selected.GroupName : "");
                    }}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                      <option key={group.GroupID} value={group.GroupID}>
                        {group.GroupName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Section"
                  icon={<Grid className="w-4 h-4" />}
                >
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={sectionId}
                    onChange={e => {
                      setSectionId(e.target.value);
                      const selected = sections.find(s => String(s.SectionID) === e.target.value);
                      setSectionName(selected ? selected.SectionName : "");
                    }}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section.SectionID} value={section.SectionID}>
                        {section.SectionName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Topic" icon={<Hash className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={topicName}
                    onChange={e => {
                      setTopicName(e.target.value);
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Topic</option>
                    {topics.map(topic => (
                      <option key={topic.TopicID} value={topic.Title}>
                        {topic.Title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleSave(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Save as Draft"}
              </button>
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateArticlePage;
