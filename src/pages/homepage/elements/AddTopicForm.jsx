import React, { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";

const AddTopicForm = () => {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("id"); // get id from query string
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch topic data if editing
  useEffect(() => {
    if (topicId) {
      const fetchTopic = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/topics/${topicId}`);
          if (!res.ok) throw new Error("Failed to fetch topic");
          const data = await res.json();

          setFormData({
            title: data.title || "",
            description: data.description || "",
            image: null,
            imagePreview: data.image
              ? `http://localhost:5000/api/topics/${topicId}/image`
              : null,
          });
        } catch (err) {
          console.error("❌ Error loading topic:", err);
          alert("Error loading topic data");
        }
      };
      fetchTopic();
    }
  }, [topicId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.image && !formData.imagePreview)
      newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const url = topicId
        ? `http://localhost:5000/api/topics/${topicId}`
        : "http://localhost:5000/api/topics";
      const method = topicId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: submitData,
      });

      if (!res.ok) throw new Error("Failed to save topic");

      const result = await res.json();
      console.log("✅ Topic saved:", result);

      alert(topicId ? "Topic updated successfully!" : "Topic created successfully!");
      navigate("/topics"); // redirect back to topics list
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {topicId ? "Edit Topic" : "Add New Topic"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter topic title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image *
            </label>
            {formData.imagePreview ? (
              <div className="relative w-48 h-48 mb-4">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter topic description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/topics")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {topicId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {topicId ? "Update Topic" : "Create Topic"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddTopicForm;
