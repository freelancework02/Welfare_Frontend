import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import { Type, FileText, Save, AlertCircle, Upload, Info } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Quill Modules and Formats Configuration
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
    ["clean"],
  ],
};

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "align",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

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

export default function CreateSection() {
  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionImage, setSectionImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSectionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionName.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Required Field",
            text: "Section name is required.",
        });
        return;
    }

    setIsSubmitting(true);
    setError("");

    try {
        const formData = new FormData();
        formData.append("SectionName", sectionName.trim());
        formData.append("SectionDescription", sectionDescription);
        if (sectionImage) {
            formData.append("image", sectionImage);
        }

        // Change the port to 5000
        const response = await axios.post("https://updated-naatacademy.onrender.com/api/sections", formData, {
            headers: { 
                "Content-Type": "multipart/form-data"
            }
        });

        if (response.data.success) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Section created successfully!",
                timer: 2000,
                showConfirmButton: false
            });

            setSectionName("");
            setSectionDescription("");
            setSectionImage(null);
            setImagePreview(null);
            
            // Optionally navigate to sections list
            navigate('/viewsection');
        } else {
            throw new Error(response.data.message || "Failed to create section");
        }
    } catch (error) {
        console.error("Error creating section:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to create section. Please try again.";
        setError(errorMessage);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
        });
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
          >
            ← Back
          </button>

          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/sections" className="hover:text-foreground">
              Sections
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Section</span>
          </nav>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Type className="w-6 h-6" /> Create New Section
                </h1>
                <p className="text-blue-100 mt-1">
                  Create a new section to organize your content
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {error}
                  </div>
                )}

                <Field
                  label="Section Name"
                  icon={<Type className="w-4 h-4" />}
                  required
                  helpText="Choose a unique and descriptive name for your section"
                >
                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="Enter section name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="Description"
                  icon={<FileText className="w-4 h-4" />}
                  helpText="Provide additional details about the section's purpose"
                >
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <ReactQuill
                      value={sectionDescription}
                      onChange={setSectionDescription}
                      modules={modules}
                      formats={formats}
                      placeholder="Enter section description (optional)"
                      theme="snow"
                      readOnly={isSubmitting}
                      style={{ height: "200px" }}
                    />
                  </div>
                </Field>

                <Field
                  label="Section Image"
                  icon={<Upload className="w-4 h-4" />}
                  helpText="Upload an image for the section (optional)"
                >
                  <div className="space-y-4">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full"
                      disabled={isSubmitting}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-xs rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </Field>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    } transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 shadow-md hover:shadow-lg`}
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "Creating..." : "Create Section"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" /> Tips for Creating Sections
              </h2>
              <ul className="space-y-2 text-blue-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Choose clear and descriptive names for easy identification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Add detailed descriptions to help users understand the
                  section's purpose
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Upload high-quality images to make sections visually appealing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
