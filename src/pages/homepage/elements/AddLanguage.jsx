import React, { useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddLanguage() {
  const [languageName, setLanguageName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!languageName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Required Field",
        text: "Please enter a language name",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("https://updated-naatacademy.onrender.com/api/languages", {
        LanguageName: languageName.trim(),
        Description: description.trim() || null
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Language added successfully!",
          timer: 1500
        });

        // Reset form and navigate
        setTimeout(() => {
          setLanguageName("");
          setDescription("");
          navigate("/viewlang");
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to create language');
      }
    } catch (error) {
      console.error("Error creating language:", error);
      let errorMessage = "Failed to create language. ";

      if (error.response?.data) {
        if (error.response.data.message === 'Language already exists') {
          errorMessage = "This language already exists in the system.";
        } else if (error.response.data.missingFields) {
          errorMessage = `Missing required fields: ${error.response.data.missingFields.join(', ')}`;
        } else {
          errorMessage += error.response.data.message || error.response.data.error;
        }
      } else if (error.request) {
        errorMessage += "No response received from server.";
      } else {
        errorMessage += error.message;
      }

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
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Language</h2>
          <button
            onClick={() => navigate("/viewlang")}
            className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg transition-all flex items-center"
          >
            ← Back to Languages
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter language name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Language..." : "Add Language"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
