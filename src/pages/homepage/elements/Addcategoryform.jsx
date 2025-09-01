import React, { useState, useEffect } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../../component/Layout';

const Addcategoryform = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id'); // get id from query string

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch category if editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/categories/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            image: null,
            imagePreview: data.image ? `http://localhost:5000/api/categories/${id}/image` : null,
          });
        })
        .catch((err) => console.error('Error fetching category:', err));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));

    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image && !formData.imagePreview) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let response;
      if (id) {
        // Update existing category
        response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: 'PUT',
          body: submitData,
        });
      } else {
        // Add new category
        response = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          body: submitData,
        });
      }

      if (!response.ok) throw new Error('Failed to save category');

      navigate('/categories'); // redirect to categories list page
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {id ? 'Edit Category' : 'Add New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Image *
            </label>
            {formData.imagePreview ? (
              <div className="relative w-48 h-48 mb-4">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed rounded-lg cursor-pointer"
              >
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload image</p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter category description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-6 py-2 border rounded-lg text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2"></div>
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {id ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Addcategoryform;
