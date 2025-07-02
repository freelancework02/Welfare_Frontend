import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../component/Layout";
import {
  Type,
  FileText,
  Save,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

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

export default function CreateSection() {
  const [sectionName, setSectionName] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate section name
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
      const response = await axios.post("http://localhost:5000/api/sections", {
        SectionName: sectionName.trim(),
        SectionDescription: sectionDescription.trim() || null
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Section created successfully!",
          timer: 2000
        });

        // Reset form
        setSectionName("");
        setSectionDescription("");
      } else {
        throw new Error(response.data.message || "Failed to create section");
      }
    } catch (error) {
      console.error("Error creating section:", error);
      setError(error.response?.data?.message || "Failed to create section. Please try again.");
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create section. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
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

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Type className="w-6 h-6" />
                  Create New Section
                </h1>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <Field label="Section Name" icon={<Type className="w-4 h-4" />} required>
                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="Enter section name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Description" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={sectionDescription}
                    onChange={(e) => setSectionDescription(e.target.value)}
                    placeholder="Enter section description (optional)"
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      flex items-center gap-2 px-6 py-2 rounded-lg text-white
                      ${isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      }
                      transition-all duration-200 ease-in-out
                      transform hover:scale-105 active:scale-100
                      shadow-md hover:shadow-lg
                    `}
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "Creating..." : "Create Section"}
                  </button>
                </div>
              </form>
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
              {/* <p className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>
                  Sections help organize your content. Create meaningful sections to better categorize your materials.
                </span>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}