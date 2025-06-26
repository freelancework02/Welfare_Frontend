import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";

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

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    slug: "",
    aboutBook: "",
    writer: "",
    published: false,
    topic: "",
    thumbnail: "",
    tags: "",
    bookName: "",
    language: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const book = docSnap.data();
          setFormData({
            ...book,
            tags: book.tags ? book.tags.join(", ") : ""
          });
        } else {
          Swal.fire("Error", "Book not found", "error");
          navigate("/admin/book/view");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, aboutBook: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookName || !formData.slug) {
      Swal.fire("Error", "Book name and slug are required", "error");
      return;
    }

    try {
      const updatedBook = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
          : [],
        modifiedOn: Timestamp.now(),
      };
      await updateDoc(doc(db, "books", id), updatedBook);
      Swal.fire("Success", "Book updated successfully", "success");
      navigate("/admin/book/view");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Book</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["bookName", "slug", "writer", "language", "topic", "tags", "thumbnail"].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="border px-4 py-2 rounded-md focus:outline-none focus:ring w-full"
            />
          ))}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            <label className="text-sm">Published</label>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-sm font-medium block mb-2">About Book</label>
            <ReactQuill
              value={formData.aboutBook}
              onChange={handleQuillChange}
              modules={modules}
              formats={formats}
              className="bg-white border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Book
          </button>
        </form>
      </div>
    </Layout>
  );
}
