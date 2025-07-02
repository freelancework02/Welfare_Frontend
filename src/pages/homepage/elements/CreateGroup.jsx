import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../component/Layout";
import {
  Users,
  FileText,
  Save,
  AlertCircle,
  Info
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate group name
    if (!groupName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Group name is required.",
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/groups", {
        GroupName: groupName.trim(),
        GroupDescription: groupDescription.trim() || null
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
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setError(error.response?.data?.message || "Failed to create group. Please try again.");
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create group. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/groups" className="hover:text-foreground">
              Groups
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Group</span>
          </nav>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Create New Group
                </h1>
                <p className="text-purple-100 mt-1">Create a new group to organize your content</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
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
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Enter group description (optional)"
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
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
                        ? 'bg-purple-400 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                      }
                      transition-all duration-200 ease-in-out
                      transform hover:scale-105 active:scale-100
                      shadow-md hover:shadow-lg
                    `}
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
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Choose clear and descriptive names for easy identification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Add detailed descriptions to help users understand the group's purpose
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  Use groups to organize related content effectively
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}