import React, { useEffect, useState } from "react";
import Layout from "../../../component/Layout";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FileText, Type } from "lucide-react";

// Font registration
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

// Quill Editor Config
const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
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
    <div className="space-y-1">
      <label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

const EditTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numbering: "",
    color: "#5a6c17",
    aboutTopic: "",
    active: true,
    topicName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const docRef = doc(db, "topics", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({
            numbering: docSnap.data().numbering || "",
            color: docSnap.data().color || "#5a6c17",
            aboutTopic: docSnap.data().aboutTopic || "",
            active: docSnap.data().active ?? true,
            topicName: docSnap.data().topicName || "",
          });
        } else {
          Swal.fire("Not Found", "Topic not found", "warning");
          navigate("/admin/topic/view");
        }
      } catch (error) {
        console.error("Error fetching topic:", error);
        Swal.fire("Error", "Failed to load topic", "error");
      }
    };

    fetchTopic();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const topicRef = doc(db, "topics", id);
      await updateDoc(topicRef, {
        ...formData,
        updatedOn: Timestamp.now(),
      });

      Swal.fire("Success", "Topic updated successfully!", "success");
      navigate("/admin/topic/view");
    } catch (error) {
      console.error("Error updating topic:", error);
      Swal.fire("Error", "Failed to update topic", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">Edit Topic</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Numbering" icon={<Type className="w-4 h-4" />}>
            <input
              type="text"
              name="numbering"
              value={formData.numbering}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled
            />
          </Field>

          <Field label="Tag Color" icon={<Type className="w-4 h-4" />}>
            <div className="flex items-center gap-4">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-gray-700 font-mono">{formData.color}</span>
            </div>
          </Field>

          <Field label="About Topic" icon={<FileText className="w-4 h-4" />}>
            <ReactQuill
              theme="snow"
              value={formData.aboutTopic}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, aboutTopic: value }))
              }
              modules={modules}
              formats={formats}
              className="bg-white border rounded-lg min-h-[136px]"
              readOnly={isSubmitting}
            />
          </Field>

          <Field label="Topic Name" icon={<Type className="w-4 h-4" />}>
            <input
              type="text"
              name="topicName"
              value={formData.topicName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </Field>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Topic"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditTopic;
