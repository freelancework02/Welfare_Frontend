import { useState, useEffect } from "react";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import axios from "axios";
import RichTextEditor from "./RichTextEditor";
import { useNavigate } from "react-router-dom";

export default function AddWriter() {
  const [form, setForm] = useState({
    Name: "",
    LanguageID: "",
    LanguageName: "",
    Status: "Active",
    GroupID: "",
    GroupName: "",
    SectionID: "",
    SectionName: "",
    Bio: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  // Example static options, replace with API if needed
  const languages = [
    { id: "urdu", name: "Urdu" },
    { id: "english", name: "English" },
    { id: "arabic", name: "Arabic" },
  ];

  useEffect(() => {
    // Fetch groups and sections from backend
    const fetchData = async () => {
      try {
        const [groupsRes, sectionsRes] = await Promise.all([
          axios.get("https://naatacadmey.onrender.com/api/groups"),
          axios.get("https://naatacadmey.onrender.com/api/sections"),
        ]);
        setGroups(groupsRes.data);
        setSections(sectionsRes.data);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch groups or sections", "error");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "LanguageID") {
        const selected = languages.find((l) => l.id === value);
        updated.LanguageName = selected ? selected.name : "";
      }
      if (name === "GroupID") {
        const selected = groups.find((g) => String(g.GroupID) === value);
        updated.GroupName = selected ? selected.GroupName : "";
      }
      if (name === "SectionID") {
        const selected = sections.find((s) => String(s.SectionID) === value);
        updated.SectionName = selected ? selected.SectionName : "";
      }
      return updated;
    });
  };

  const handleBioChange = (content) => {
    setForm((prev) => ({ ...prev, Bio: content }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Name || !form.LanguageID) {
      Swal.fire("Error", "Name and Language are required", "error");
      return;
    }
    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key] || "");
    });
    if (profilePic) {
      data.append("image", profilePic);
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/writers",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        Swal.fire("Success", "Writer created successfully!", "success");
        setForm({
          Name: "",
          LanguageID: "",
          LanguageName: "",
          Status: "Active",
          GroupID: "",
          GroupName: "",
          SectionID: "",
          SectionName: "",
          Bio: "",
        });
        setProfilePic(null);
        setPreview(null);
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create writer",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Add Writer</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-400 mb-2"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                  <span className="text-gray-400">Upload Photo</span>
                </div>
              )}
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-sm text-blue-600 hover:underline">
                {profilePic ? "Change" : "Choose"} Profile Picture
              </span>
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Language */}
          <div>
            <label className="block font-medium mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              name="LanguageID"
              value={form.LanguageID}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="Status"
              value={form.Status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Group */}
          <div>
            <label className="block font-medium mb-1">Group</label>
            <select
              name="GroupID"
              value={form.GroupID}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.GroupID} value={group.GroupID}>
                  {group.GroupName}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block font-medium mb-1">Section</label>
            <select
              name="SectionID"
              value={form.SectionID}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.SectionID} value={section.SectionID}>
                  {section.SectionName}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <RichTextEditor
              value={form.Bio}
              onChange={handleBioChange}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Writer"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
