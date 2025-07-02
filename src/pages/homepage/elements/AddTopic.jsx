import React, { useState, useEffect } from "react";
import Layout from "../../../component/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateTopic() {
  const [form, setForm] = useState({
    Title: "",
    CategoryID: "",
    CategoryName: "",
    Slug: "",
    GroupID: "",
    GroupName: "",
    Description: "",
    IsDeleted: 0,
  });
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get("https://naatacadmey.onrender.com/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
    axios.get("https://naatacadmey.onrender.com/api/groups")
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setForm(f => ({
      ...f,
      Title: value,
      Slug: value
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => {
      let updated = { ...f, [name]: value };
      if (name === "CategoryID") {
        const selected = categories.find(c => String(c.CategoryID) === value);
        updated.CategoryName = selected ? selected.Name : "";
      }
      if (name === "GroupID") {
        const selected = groups.find(g => String(g.GroupID) === value);
        updated.GroupName = selected ? selected.GroupName : "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Title || !form.CategoryID || !form.Slug) {
      Swal.fire("Missing Fields", "Title, Category, and Slug are required!", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/topics", form);
      if (response.data.success) {
        Swal.fire("Success", "Topic created successfully!", "success");
        setForm({
          Title: "",
          CategoryID: "",
          CategoryName: "",
          Slug: "",
          GroupID: "",
          GroupName: "",
          Description: "",
          IsDeleted: 0,
        });
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to create topic", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Create Topic</h1>
          <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-8 max-w-2xl mx-auto space-y-6 shadow">
            <div>
              <label className="block font-medium mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="Title"
                value={form.Title}
                onChange={handleTitleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Slug <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="Slug"
                value={form.Slug}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Category <span className="text-red-500">*</span></label>
              <select
                name="CategoryID"
                value={form.CategoryID}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>{cat.Name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Group</label>
              <select
                name="GroupID"
                value={form.GroupID}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={isSubmitting}
              >
                <option value="">Select Group</option>
                {groups.map(group => (
                  <option key={group.GroupID} value={group.GroupID}>{group.GroupName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <ReactQuill
                theme="snow"
                value={form.Description}
                onChange={val => setForm(f => ({ ...f, Description: val }))}
                className="bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Topic"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}