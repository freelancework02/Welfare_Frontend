import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import axios from "axios";
import { Link } from "react-router-dom";
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

export default function AddBook() {
  // State for each field
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [languageName, setLanguageName] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [publicationYear, setPublicationYear] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [writers, setWriters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);
  const fileInputRef = useRef();
  const staticLanguages = [
    { id: 1, name: "Urdu" },
    { id: 2, name: "English" },
    { id: 3, name: "Hindi" },
  ];

  useEffect(() => {
    axios.get("https://naatacadmey.onrender.com/api/writers").then(res => setWriters(res.data)).catch(() => setWriters([]));
    axios.get("https://naatacadmey.onrender.com/api/categories").then(res => setCategories(res.data)).catch(() => setCategories([]));
    axios.get("https://naatacadmey.onrender.com/api/groups").then(res => setGroups(res.data)).catch(() => setGroups([]));
    axios.get("https://naatacadmey.onrender.com/api/sections").then(res => setSections(res.data)).catch(() => setSections([]));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const previewURL = URL.createObjectURL(file);
    setCoverImageURL(previewURL);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let finalCoverImageURL = coverImageURL;
      // If there's an image to upload
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        try {
          const uploadResponse = await axios.post('https://updated-naatacademy.onrender.com/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          finalCoverImageURL = uploadResponse.data.imageUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Swal.fire({
            icon: "error",
            title: "Image Upload Failed",
            text: "Failed to upload image. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }
      }
      // Validate required fields
      if (!title.trim() || !authorId || !categoryId || !languageId) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Fields",
          text: "Please fill all required fields (Title, Writer, Category, and Language).",
        });
        setIsSubmitting(false);
        return;
      }
      // Ensure IDs are strings (since DB columns are varchar)
      const bookData = {
        Title: title,
        AuthorID: authorId,
        AuthorName: authorName,
        CategoryID: categoryId,
        CategoryName: categoryName,
        GroupID: groupId || "",
        GroupName: groupName,
        SectionID: sectionId || "",
        SectionName: sectionName,
        LanguageID: languageId,
        LanguageName: languageName,
        CoverImageURL: finalCoverImageURL,
        PublicationYear: publicationYear,
        Description: description,
      };
      // Submit book
      const response = await axios.post('https://updated-naatacademy.onrender.com/api/books', bookData);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Book created successfully!",
          timer: 2000
        });
        // Reset form
        setTitle("");
        setAuthorId("");
        setAuthorName("");
        setCategoryId("");
        setCategoryName("");
        setGroupId("");
        setGroupName("");
        setSectionId("");
        setSectionName("");
        setLanguageId("");
        setLanguageName("");
        setCoverImageURL("");
        setImageFile(null);
        setPublicationYear("");
        setDescription("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsSubmitting(false);
      } else {
        throw new Error(response.data.message || 'Failed to create book');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Something went wrong while creating the book.';
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      setIsSubmitting(false);
    }
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
            <Link to="/books" className="hover:text-foreground">
              Books
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Add Book</span>
          </nav>
          <h1 className="text-2xl font-bold mb-8">Add Book</h1>
          <div className="bg-slate-50 rounded-lg p-8">
            <section className="mb-6">
              <Field label="Cover Image" icon={<ImageIcon className="w-4 h-4" />}>
                <div className="max-w-md">
                  <div
                    className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {coverImageURL ? (
                      <img
                        src={coverImageURL}
                        alt="Cover Preview"
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
                <Field label="Book Title" icon={<Type className="w-4 h-4" />} required>
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </Field>
                <Field label="Description" icon={<FileText className="w-4 h-4" />}>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    readOnly={isSubmitting}
                  />
                </Field>
              </div>
              <div className="space-y-6">
                <Field label="Author" icon={<Users className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={authorId}
                    onChange={e => {
                      setAuthorId(e.target.value);
                      const selected = writers.find(w => String(w.WriterID) === e.target.value);
                      setAuthorName(selected ? selected.Name : "");
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Writer</option>
                    {writers.map(writer => (
                      <option key={writer.WriterID} value={writer.WriterID}>{writer.Name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Category" icon={<Grid className="w-4 h-4" />} required>
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
                      <option key={category.CategoryID} value={category.CategoryID}>{category.Name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Group" icon={<Layers className="w-4 h-4" />}>
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
                      <option key={group.GroupID} value={group.GroupID}>{group.GroupName}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Section" icon={<Grid className="w-4 h-4" />}>
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
                      <option key={section.SectionID} value={section.SectionID}>{section.SectionName}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Language" icon={<Globe className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={languageId}
                    onChange={e => {
                      setLanguageId(e.target.value);
                      const selected = staticLanguages.find(l => String(l.id) === e.target.value);
                      setLanguageName(selected ? selected.name : "");
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Language</option>
                    {staticLanguages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Publication Year" icon={<CalendarIcon className="w-4 h-4" />} required>
                  <input
                    type="date"
                    className="border rounded-lg p-2 w-full"
                    value={publicationYear}
                    onChange={e => setPublicationYear(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </Field>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
