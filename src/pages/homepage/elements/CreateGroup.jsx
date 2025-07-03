import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import {
  Users,
  FileText,
  Save,
  AlertCircle,
  Info,
  Upload
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Quill Configuration
const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"]
  ]
};

const formats = [
  "font", "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "script", "align",
  "list", "bullet", "indent",
  "link", "image"
];

// Field Component
function Field({ label, icon, children, required, helpText }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="w-4 h-4" />
          {helpText}
        </p>
      )}
    </div>
  );
}

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Group name is required."
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("GroupName", groupName.trim());
      formData.append("GroupDescription", groupDescription || "");
      if (groupImage) {
        formData.append("image", groupImage);
      }

      const response = await axios.post("https://updated-naatacademy.onrender.com/api/groups", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Group created successfully!",
          timer: 2000,
          showConfirmButton: false
        });

        // Reset form
        setGroupName("");
        setGroupDescription("");
        setGroupImage(null);
        setImagePreview(null);
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (err) {
      console.error("Error creating group:", err);
      const errMsg = err.response?.data?.message || "Failed to create group. Please try again.";
      setError(errMsg);
      Swal.fire({ icon: "error", title: "Error", text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
          >
            ← Back
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/groups" className="hover:text-foreground">Groups</Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Group</span>
          </nav>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Create New Group
                </h1>
                <p className="text-purple-100 mt-1">Create a new group to organize your content</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <Field
                  label="Group Name"
                  icon={<Users className="w-4 h-4" />}
                  required
                  helpText="Choose a unique and descriptive name for your group"
                >
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="Description"
                  icon={<FileText className="w-4 h-4" />}
                  helpText="Provide additional details about the group's purpose"
                >
                  <div className="border rounded-lg overflow-hidden">
                    <ReactQuill
                      value={groupDescription}
                      onChange={setGroupDescription}
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      placeholder="Enter group description (optional)"
                      readOnly={isSubmitting}
                      className="bg-white"
                      style={{ height: "200px" }}
                    />
                  </div>
                </Field>

                <Field
                  label="Group Image"
                  icon={<Upload className="w-4 h-4" />}
                  helpText="Upload an image for the group (optional)"
                >
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                      disabled={isSubmitting}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs rounded-lg border border-gray-200"
                      />
                    )}
                  </div>
                </Field>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white ${
                      isSubmitting
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                    } transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-md hover:shadow-lg`}
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "Creating..." : "Create Group"}
                  </button>
                </div>
              </form>
            </div>

            {/* Help Card */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-purple-700 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Tips for Creating Groups
              </h2>
              <ul className="space-y-2 text-purple-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  Use unique and meaningful group names.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  Add descriptions to help users understand purpose.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  Upload relevant images to improve user experience.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
