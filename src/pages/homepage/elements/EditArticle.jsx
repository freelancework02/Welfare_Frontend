import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../component/Layout";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";

import {
  CalendarIcon,
  FileText,
  Users,
  Globe,
  Hash,
  Type,
} from "lucide-react";

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

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    topic: "",
    language: "",
    writers: "",
    translator: "",
    tags: "",
    publicationDate: "",
    published: false,
    BlogText: {
      english: "",
      urdu: "",
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articlePosts", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            title: data.title || "",
            topic: data.topic || "",
            language: data.language || "",
            writers: data.writers || "",
            translator: data.translator || "",
            tags: (data.tags || []).join(", "),
            publicationDate: data.publicationDate || new Date().toISOString().split("T")[0],
            published: data.published || false,
            BlogText: {
              english: data.BlogText?.english || "",
              urdu: data.BlogText?.urdu || "",
            },
          });
        } else {
          Swal.fire("Not Found", "Article not found", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Could not fetch article data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "published") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.language || !form.writers) {
      Swal.fire("Validation Error", "Title, language and writers are required.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const updatedData = {
        ...form,
        tags: tagsArray,
        modifiedOn: serverTimestamp(),
      };

      const docRef = doc(db, "articlePosts", id);
      await updateDoc(docRef, updatedData);

      Swal.fire("Success", "Article updated successfully", "success").then(() => {
        navigate("/articles");
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", "Failed to update article", "error");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">Loading article data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/articles" className="hover:text-foreground">Articles</Link>
            <span>&gt;</span>
            <span className="text-foreground">Edit Article</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8">Edit Article</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Field label="Article Title" icon={<Type className="w-4 h-4" />}>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  />
                </Field>

                <Field label="English Description" icon={<FileText className="w-4 h-4" />}>
                  <ReactQuill
                    theme="snow"
                    value={form.BlogText.english}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        BlogText: { ...prev.BlogText, english: value },
                      }))
                    }
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                  />
                </Field>

                <Field label="Urdu Description" icon={<FileText className="w-4 h-4" />}>
                  <ReactQuill
                    theme="snow"
                    value={form.BlogText.urdu}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        BlogText: { ...prev.BlogText, urdu: value },
                      }))
                    }
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    style={{ direction: "rtl", textAlign: "right" }}
                  />
                </Field>
              </div>

              <div className="space-y-6">
                <Field label="Topic" icon={<FileText className="w-4 h-4" />}>
                  <input
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </Field>

                <Field label="Language" icon={<Globe className="w-4 h-4" />}>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  >
                    <option value="">Select Language</option>
                    {["Urdu", "Roman", "English"].map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Writer" icon={<Users className="w-4 h-4" />}>
                  <input
                    name="writers"
                    value={form.writers}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                    required
                  />
                </Field>

                <Field label="Translator" icon={<Users className="w-4 h-4" />}>
                  <input
                    name="translator"
                    value={form.translator}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </Field>

                <Field label="Tags (comma-separated)" icon={<Hash className="w-4 h-4" />}>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </Field>

                <Field label="Publication Date" icon={<CalendarIcon className="w-4 h-4" />}>
                  <input
                    name="publicationDate"
                    type="date"
                    value={form.publicationDate}
                    onChange={handleChange}
                    className="border rounded-lg p-2 w-full"
                  />
                </Field>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                  />
                  <label>Published</label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
