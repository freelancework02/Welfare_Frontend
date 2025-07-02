import React, { useState, useEffect } from "react";
import { CloudUploadIcon, FileText } from "lucide-react";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import axios from "axios";

const Font = Quill.import('formats/font');
Font.whitelist = [
  'sans-serif', 'serif', 'monospace',
  'Amiri', 'Rubik-Bold', 'Rubik-Light',
  'Scheherazade-Regular', 'Scheherazade-Bold',
  'Aslam', 'Mehr-Nastaliq'
];

Quill.register(Font, true);

const modules = {
  toolbar: [
    [
      {
        font: [
          'Amiri',
          'Rubik-Bold',
          'Rubik-Light',
          'Scheherazade-Regular',
          'Scheherazade-Bold',
          'Aslam',
          'Mehr-Nastaliq',
          'serif',
          'sans-serif',
          'monospace'
        ]
      },
      { size: [] }
    ],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const formats = [
  'font',
  'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'header',
  'align',
  'blockquote', 'code-block',
  'list', 'bullet',
  'indent',
  'link', 'image', 'video',
  'clean'
];

export default function CreateWriterForm() {
  const [formData, setFormData] = useState({
    Name: "",
    LanguageID: "",
    LanguageName: "",
    Status: "Active",
    GroupID: "",
    GroupName: "",
    SectionID: "",
    SectionName: "",
    Bio: "",
    ProfileImageURL: ""
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [languages, setLanguages] = useState([]);

  // Fetch groups, sections, and languages on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, sectionsRes] = await Promise.all([
          axios.get('https://naatacadmey.onrender.com/api/groups'),
          axios.get('https://naatacadmey.onrender.com/api/sections')
        ]);
        setGroups(groupsRes.data);
        setSections(sectionsRes.data);
        // Set default languages
        setLanguages([
          { id: 'urdu', name: 'Urdu' },
          { id: 'english', name: 'English' },
          { id: 'arabic', name: 'Arabic' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch required data', 'error');
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      Swal.fire('Error', 'Please select an image file (JPEG, PNG, etc.)', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    setProfilePic(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Update related names when IDs change
      if (name === 'GroupID') {
        const selectedGroup = groups.find(g => g.GroupID === value);
        updatedData.GroupName = selectedGroup ? selectedGroup.GroupName : '';
      } else if (name === 'SectionID') {
        const selectedSection = sections.find(s => s.SectionID === value);
        updatedData.SectionName = selectedSection ? selectedSection.SectionName : '';
      } else if (name === 'LanguageID') {
        const selectedLanguage = languages.find(l => l.id === value);
        updatedData.LanguageName = selectedLanguage ? selectedLanguage.name : '';
      }
      
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Name || !formData.LanguageID) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (profilePic) {
      formDataToSend.append("image", profilePic);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/writers",
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Writer Created Successfully!',
          text: `Writer ID: ${response.data.writerId}`,
          timer: 3000,
          showConfirmButton: false
        });

        // Reset form
        setFormData({
          Name: "",
          LanguageID: "",
          LanguageName: "",
          Status: "Active",
          GroupID: "",
          GroupName: "",
          SectionID: "",
          SectionName: "",
          Bio: "",
          ProfileImageURL: ""
        });
        setProfilePic(null);
        setPreview(null);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || "Failed to create writer",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Create Writer</h1>
          <p className="text-gray-500">Add a new writer to your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <h3 className="text-base font-medium mb-4">Profile Picture</h3>
                <label
                  htmlFor="profile-upload"
                  className="relative border-2 border-dashed border-gray-300 rounded-full w-48 h-48 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-center">
                      <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Upload Photo</p>
                    </div>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Writer Details Section */}
              <div className="md:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="LanguageID"
                      value={formData.LanguageID}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Language</option>
                      {languages.map(lang => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Group
                    </label>
                    <select
                      name="GroupID"
                      value={formData.GroupID}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Group</option>
                      {groups.map(group => (
                        <option key={group.GroupID} value={group.GroupID}>
                          {group.GroupName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <select
                      name="SectionID"
                      value={formData.SectionID}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section.SectionID} value={section.SectionID}>
                          {section.SectionName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="Status"
                      value={formData.Status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.Bio}
                    onChange={(content) => setFormData(prev => ({ ...prev, Bio: content }))}
                    modules={modules}
                    formats={formats}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Writer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}