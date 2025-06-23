import React, { useState } from 'react';
import Layout from '../../../component/Layout';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig";
import Swal from 'sweetalert2';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FileText, Type } from "lucide-react";

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
  ]
};

const formats = [
  "font", "size", "bold", "italic", "underline", "strike",
  "color", "background", "script", "header", "align",
  "blockquote", "code-block", "list", "bullet", "indent",
  "link", "image", "video", "clean",
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

const CreateTopic = () => {
  const [formData, setFormData] = useState({
    numbering: '',
    color: '#5a6c17', // default color
    aboutTopic: '',
    active: true,
    topicName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'topics'), {
        numbering: formData.numbering,
        color: formData.color,
        aboutTopic: formData.aboutTopic,
        active: formData.active,
        topicName: formData.topicName,
        createdOn: Timestamp.now(),
      });

      Swal.fire('Success', 'Topic added to Firestore!', 'success');
      setFormData({
        numbering: '',
        color: '#5a6c17',
        aboutTopic: '',
        active: true,
        topicName: '',
      });
    } catch (error) {
      console.error('Error adding topic:', error);
      Swal.fire('Error', 'Failed to add topic', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">Add New Topic</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Numbering" icon={<Type className="w-4 h-4" />}>
            <input
              type="text"
              name="numbering"
              value={formData.numbering}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
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
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateTopic;
