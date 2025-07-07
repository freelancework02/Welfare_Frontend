import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../../../component/Layout";
import {
  CalendarIcon,
  ImageIcon,
  Type,
  FileText,
  Users,
  Globe,
  Hash,
  Bookmark,
  BookOpen,
  Star,
  CheckCircle,
  Grid,
  Layers,
  ArrowLeft
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import axios from "axios";

// Font registration for Quill
const Font = Quill.import("formats/font");
Font.whitelist = [
  "sans-serif",
  "serif",
  "monospace",
  "Amiri",
  "Rubik-Bold",
  "Rubik-Light",
  "Scheherazade-Regular",
  "Scheherazade-Bold",
  "Aslam",
  "Mehr-Nastaliq",
];
Quill.register(Font, true);

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Quill editor settings
const modules = {
  toolbar: [
    [{ font: Font.whitelist }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "header",
  "align",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "clean",
];

function Field({ label, icon, children, required = false }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function UpdateKalaamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [kalaam, setKalaam] = useState({
    Title: "",
    Description: "",
    Language: "urdu",
    PublicationDate: getCurrentDate(),
    IsFeatured: false,
    IsSelected: false,
    WriterID: "",
    WriterName: "",
    CategoryID: "",
    CategoryName: "",
    GroupID: "",
    GroupName: "",
    SectionID: "",
    SectionName: "",
    ContentUrdu: "",
    ContentRomanUrdu: "",
    ContentEnglish: "",
    ContentHindi: "",
    ContentArabic: "",
    ContentSharha: "",
    ContentTranslate: ""
  });
  
  const [lineSpacing, setLineSpacing] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [writers, setWriters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);

  // Fetch kalaam data and all required reference data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all reference data in parallel
        const [writersRes, categoriesRes, groupsRes, sectionsRes, kalaamRes] = await Promise.all([
          axios.get("https://naatacadmey.onrender.com/api/writers"),
          axios.get("https://naatacadmey.onrender.com/api/categories"),
          axios.get("https://naatacadmey.onrender.com/api/groups"),
          axios.get("https://naatacadmey.onrender.com/api/sections"),
          axios.get(`http://localhost:5000/api/kalaam/${id}`)
        ]);

        setWriters(writersRes.data);
        setCategories(categoriesRes.data);
        setGroups(groupsRes.data);
        setSections(sectionsRes.data);
        
        // Set kalaam data with proper defaults
        const kalaamData = kalaamRes.data;
        setKalaam({
          Title: kalaamData.Title || "",
          Description: kalaamData.Description || "",
          Language: kalaamData.Language || "urdu",
          PublicationDate: kalaamData.PublicationDate || getCurrentDate(),
          IsFeatured: kalaamData.IsFeatured === 1,
          IsSelected: kalaamData.IsSelected === 1,
          WriterID: kalaamData.WriterID || "",
          WriterName: kalaamData.WriterName || "",
          CategoryID: kalaamData.CategoryID || "",
          CategoryName: kalaamData.CategoryName || "",
          GroupID: kalaamData.GroupID || "",
          GroupName: kalaamData.GroupName || "",
          SectionID: kalaamData.SectionID || "",
          SectionName: kalaamData.SectionName || "",
          ContentUrdu: kalaamData.ContentUrdu || "",
          ContentRomanUrdu: kalaamData.ContentRomanUrdu || "",
          ContentEnglish: kalaamData.ContentEnglish || "",
          ContentHindi: kalaamData.ContentHindi || "",
          ContentArabic: kalaamData.ContentArabic || "",
          ContentSharha: kalaamData.ContentSharha || "",
          ContentTranslate: kalaamData.ContentTranslate || ""
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch required data. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatTextWithSpacing = (text) => {
    if (!text) return "";
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return "";
    
    let result = [];
    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i]);
      if ((i + 1) % lineSpacing === 0 && i !== lines.length - 1) {
        result.push('');
      }
    }
    return result.join('\n');
  };

  const handleTextChange = (field) => (e) => {
    const text = e.target.value;
    const lines = text.split('\n');
    
    if (lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
      setKalaam(prev => ({ ...prev, [field]: lines.slice(0, -1).join('\n') }));
    } else {
      setKalaam(prev => ({ ...prev, [field]: text }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setKalaam(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (field, idField, nameField) => (e) => {
    const selectedId = e.target.value;
    const selectedOption = e.target.selectedOptions[0].text;
    
    setKalaam(prev => ({
      ...prev,
      [idField]: selectedId,
      [nameField]: selectedId ? selectedOption : ""
    }));
  };

  const handleUpdate = async () => {
    if (!kalaam.Title.trim() || !kalaam.WriterID || !kalaam.CategoryID) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Fields",
        text: "Please fill all required fields including title, writer and category.",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const payload = {
        Title: kalaam.Title.trim(),
        Description: kalaam.Description,
        WriterID: kalaam.WriterID,
        WriterName: kalaam.WriterName,
        CategoryID: kalaam.CategoryID,
        CategoryName: kalaam.CategoryName,
        ContentUrdu: formatTextWithSpacing(kalaam.ContentUrdu) || null,
        ContentRomanUrdu: formatTextWithSpacing(kalaam.ContentRomanUrdu) || null,
        ContentArabic: formatTextWithSpacing(kalaam.ContentArabic) || null,
        ContentEnglish: formatTextWithSpacing(kalaam.ContentEnglish) || null,
        ContentHindi: formatTextWithSpacing(kalaam.ContentHindi) || null,
        ContentSharha: formatTextWithSpacing(kalaam.ContentSharha) || null,
        ContentTranslate: formatTextWithSpacing(kalaam.ContentTranslate) || null,
        GroupID: kalaam.GroupID || null,
        GroupName: kalaam.GroupName || null,
        SectionID: kalaam.SectionID || null,
        SectionName: kalaam.SectionName || null,
        IsFeatured: kalaam.IsFeatured ? 1 : 0,
        IsSelected: kalaam.IsSelected ? 1 : 0,
        PublicationDate: kalaam.PublicationDate,
        Language: kalaam.Language
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await axios.put(`https://updated-naatacademy.onrender.com/api/kalaam/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Kalaam updated successfully!",
          timer: 2000
        }).then(() => {
          navigate("/viewkalam");
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "Failed to update kalaam. ";
      
      if (error.response) {
        if (error.response.data) {
          errorMessage += error.response.data.message || error.response.data.error || 
                         `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        errorMessage += "No response received from server. Please check your connection.";
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading kalaam data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/viewkalam" className="hover:text-foreground">
              Kalam
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Update Kalam</span>
          </nav>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Update Kalam</h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Kalam List
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Field label="Kalam Title" icon={<Type className="w-4 h-4" />} required>
                  <input
                    type="text"
                    name="Title"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={kalaam.Title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="Description"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={kalaam.Description || ""}
                    onChange={(value) => setKalaam(prev => ({ ...prev, Description: value }))}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    readOnly={isSubmitting}
                  />
                </Field>

                {/* Line Spacing Radio Buttons */}
                <Field label="Line Spacing" icon={<FileText className="w-4 h-4" />}>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <label key={num} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="lineSpacing"
                          value={num}
                          checked={lineSpacing === num}
                          onChange={() => setLineSpacing(num)}
                          disabled={isSubmitting}
                        />
                        {num} Line{num !== 1 ? 's' : ''}
                      </label>
                    ))}
                  </div>
                </Field>

                {/* Text content fields */}
                <Field label="Post Urdu" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentUrdu"
                    value={formatTextWithSpacing(kalaam.ContentUrdu)}
                    onChange={handleTextChange('ContentUrdu')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg font-urdu"
                    style={{ 
                      direction: "rtl", 
                      textAlign: "right",
                      lineHeight: "2",
                      fontSize: "18px"
                    }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Roman" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentRomanUrdu"
                    value={formatTextWithSpacing(kalaam.ContentRomanUrdu)}
                    onChange={handleTextChange('ContentRomanUrdu')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post English" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentEnglish"
                    value={formatTextWithSpacing(kalaam.ContentEnglish)}
                    onChange={handleTextChange('ContentEnglish')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Hindi" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentHindi"
                    value={formatTextWithSpacing(kalaam.ContentHindi)}
                    onChange={handleTextChange('ContentHindi')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Arabic" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentArabic"
                    value={formatTextWithSpacing(kalaam.ContentArabic)}
                    onChange={handleTextChange('ContentArabic')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg font-arabic"
                    style={{ 
                      direction: "rtl", 
                      textAlign: "right",
                      lineHeight: "2",
                      fontSize: "18px"
                    }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Sharha" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentSharha"
                    value={formatTextWithSpacing(kalaam.ContentSharha)}
                    onChange={handleTextChange('ContentSharha')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Translate" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="ContentTranslate"
                    value={formatTextWithSpacing(kalaam.ContentTranslate)}
                    onChange={handleTextChange('ContentTranslate')}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>
              </div>

              <div className="space-y-6">
                <Field label="Category" icon={<Grid className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={kalaam.CategoryID}
                    onChange={handleSelectChange('categories', 'CategoryID', 'CategoryName')}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.CategoryID} value={category.CategoryID}>
                        {category.Name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Language" icon={<Globe className="w-4 h-4" />}>
                  <select
                    name="Language"
                    value={kalaam.Language}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="urdu">Urdu</option>
                    <option value="english">English</option>
                    <option value="arabic">Arabic</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </Field>

                <Field label="Writer" icon={<Users className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={kalaam.WriterID}
                    onChange={handleSelectChange('writers', 'WriterID', 'WriterName')}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Writer</option>
                    {writers.map(writer => (
                      <option key={writer.WriterID} value={writer.WriterID}>
                        {writer.Name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Group" icon={<Layers className="w-4 h-4" />}>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={kalaam.GroupID}
                    onChange={handleSelectChange('groups', 'GroupID', 'GroupName')}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                      <option key={group.GroupID} value={group.GroupID}>
                        {group.GroupName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Section" icon={<Grid className="w-4 h-4" />}>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={kalaam.SectionID}
                    onChange={handleSelectChange('sections', 'SectionID', 'SectionName')}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section.SectionID} value={section.SectionID}>
                        {section.SectionName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Publication Date" icon={<CalendarIcon className="w-4 h-4" />}>
                  <input
                    type="date"
                    name="PublicationDate"
                    value={kalaam.PublicationDate}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Options" icon={<Star className="w-4 h-4" />}>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="IsFeatured"
                        checked={kalaam.IsFeatured}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" /> Featured
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="IsSelected"
                        checked={kalaam.IsSelected}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Selected
                      </span>
                    </label>
                  </div>
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/viewkalam")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Kalaam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}