import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../../component/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewLanguages() {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    languageName: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://updated-naatacademy.onrender.com/api/languages");
      if (Array.isArray(response.data)) {
        setLanguages(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      let errorMessage = "Failed to fetch languages. ";
      
      if (error.response?.data) {
        errorMessage += error.response.data.message || error.response.data.error;
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
      setLanguages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        setIsSubmitting(true);
        const response = await axios.delete(`https://updated-naatacademy.onrender.com/api/languages/${id}`);

        if (response.data.success) {
          await fetchLanguages(); // Refresh the list after successful deletion
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Language has been deleted.",
            timer: 1500
          });
        } else {
          throw new Error(response.data.message || "Failed to delete language");
        }
      }
    } catch (error) {
      console.error("Error deleting language:", error);
      let errorMessage = "Failed to delete language. ";
      
      if (error.response?.data) {
        errorMessage += error.response.data.message || error.response.data.error;
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

  const handleUpdate = async (id) => {
    try {
      if (!editForm.languageName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Language name is required",
        });
        return;
      }

      setIsSubmitting(true);
      const response = await axios.put(`https://updated-naatacademy.onrender.com/api/languages/${id}`, {
        LanguageName: editForm.languageName.trim(),
        Description: editForm.description.trim() || null
      });

      if (response.data.success) {
        await fetchLanguages(); // Refresh the list after successful update
        setEditingId(null);
        setEditForm({ languageName: "", description: "" });
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Language updated successfully.",
          timer: 1500
        });
      } else {
        throw new Error(response.data.message || "Failed to update language");
      }
    } catch (error) {
      console.error("Error updating language:", error);
      let errorMessage = "Failed to update language. ";
      
      if (error.response?.data) {
        if (error.response.data.message === 'Language name already exists') {
          errorMessage = "This language name already exists.";
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

  useEffect(() => {
    fetchLanguages();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
          <div className="text-center">Loading languages...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">Languages List</h2>
          <button
            onClick={() => navigate("/addlang")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
          >
            Add Language
          </button>
        </div>
        {languages.length === 0 ? (
          <div className="text-center text-gray-500">No languages found</div>
        ) : (
          <ul className="space-y-4">
            {languages.map((lang) => (
              <li
                key={lang.LanguageID}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
              >
                {editingId === lang.LanguageID ? (
                  <>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.languageName}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          languageName: e.target.value
                        })}
                        placeholder="Language name"
                        disabled={isSubmitting}
                      />
                      <textarea
                        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm.description}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          description: e.target.value
                        })}
                        placeholder="Description (optional)"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(lang.LanguageID)}
                        className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm({ languageName: "", description: "" });
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{lang.LanguageName}</h3>
                      {lang.Description && (
                        <p className="text-gray-600 text-sm mt-1">{lang.Description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(lang.LanguageID);
                          setEditForm({
                            languageName: lang.LanguageName,
                            description: lang.Description || ""
                          });
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lang.LanguageID)}
                        className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
