import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Layers
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

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateArticlePage() {
  const [articleTitle, setArticleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("urdu");
  const [publicationDate, setPublicationDate] = useState(getCurrentDate());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // IDs and Names states (similar to CreateBookPage)
  const [writerId, setWriterId] = useState("");
  const [writerName, setWriterName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");

  // Data states
  const [writers, setWriters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);

  // Text content states
  const [postUrdu, setPostUrdu] = useState("");
  const [postRoman, setPostRoman] = useState("");
  const [postEnglish, setPostEnglish] = useState("");
  const [postHindi, setPostHindi] = useState("");
  const [postArabic, setPostArabic] = useState("");
  const [postSharha, setPostSharha] = useState("");
  const [postTranslate, setPostTranslate] = useState("");
  const [lineSpacing, setLineSpacing] = useState(2);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [writersRes, categoriesRes, groupsRes, sectionsRes] = await Promise.all([
          axios.get("https://naatacadmey.onrender.com/api/writers"),
          axios.get("https://naatacadmey.onrender.com/api/categories"),
          axios.get("https://naatacadmey.onrender.com/api/groups"),
          axios.get("https://naatacadmey.onrender.com/api/sections")
        ]);

        setWriters(writersRes.data);
        setCategories(categoriesRes.data);
        setGroups(groupsRes.data);
        setSections(sectionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch required data. Please refresh the page.",
        });
      }
    };

    fetchData();
  }, []);

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

  const handleTextChange = (setter) => (e) => {
    const text = e.target.value;
    const lines = text.split('\n');
    
    if (lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
      setter(lines.slice(0, -1).join('\n'));
    } else {
      setter(text);
    }
  };

  const handleSave = async () => {
    if (!articleTitle.trim() || !writerId || !categoryId) {
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
        Title: articleTitle.trim(),
        Description: description,
        WriterID: writerId,
        WriterName: writerName,
        CategoryID: categoryId,
        CategoryName: categoryName,
        ContentUrdu: formatTextWithSpacing(postUrdu) || null,
        ContentRomanUrdu: formatTextWithSpacing(postRoman) || null,
        ContentArabic: formatTextWithSpacing(postArabic) || null,
        ContentEnglish: formatTextWithSpacing(postEnglish) || null,
        ContentHindi: formatTextWithSpacing(postHindi) || null,
        ContentSharha: formatTextWithSpacing(postSharha) || null,
        ContentTranslate: formatTextWithSpacing(postTranslate) || null,
        GroupID: groupId || null,
        GroupName: groupName || null,
        SectionID: sectionId || null,
        SectionName: sectionName || null,
        IsFeatured: isFeatured ? 1 : 0,
        IsSelected: isSelected ? 1 : 0,
        PublicationDate: publicationDate,
        Language: selectedLanguage
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await axios.post("https://updated-naatacademy.onrender.com/api/kalaam", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Kalaam created successfully!",
          timer: 2000
        });
  
        // Reset form
        setArticleTitle("");
        setDescription("");
        setCategoryId("");
        setCategoryName("");
        setWriterId("");
        setWriterName("");
        setPostUrdu("");
        setPostRoman("");
        setPostEnglish("");
        setPostHindi("");
        setPostArabic("");
        setPostSharha("");
        setPostTranslate("");
        setGroupId("");
        setGroupName("");
        setSectionId("");
        setSectionName("");
        setIsFeatured(false);
        setIsSelected(false);
        setPublicationDate(getCurrentDate());
      }
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "Failed to create kalaam. ";
      
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

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/articles" className="hover:text-foreground">
              Kalam
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Create Kalam</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8">Create Kalam</h1>

          <div className="bg-slate-50 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Field label="Kalam Title" icon={<Type className="w-4 h-4" />}>
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
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
                    value={description || ""}
                    onChange={setDescription}
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
                    value={formatTextWithSpacing(postUrdu)}
                    onChange={handleTextChange(setPostUrdu)}
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
                    value={formatTextWithSpacing(postRoman)}
                    onChange={handleTextChange(setPostRoman)}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post English" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={formatTextWithSpacing(postEnglish)}
                    onChange={handleTextChange(setPostEnglish)}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Hindi" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={formatTextWithSpacing(postHindi)}
                    onChange={handleTextChange(setPostHindi)}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Arabic" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={formatTextWithSpacing(postArabic)}
                    onChange={handleTextChange(setPostArabic)}
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
                    value={formatTextWithSpacing(postSharha)}
                    onChange={handleTextChange(setPostSharha)}
                    cols="30"
                    rows="10"
                    className="border w-full p-2 rounded-lg"
                    style={{ lineHeight: "2" }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Translate" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={formatTextWithSpacing(postTranslate)}
                    onChange={handleTextChange(setPostTranslate)}
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
                    value={categoryId}
                    onChange={e => {
                      setCategoryId(e.target.value);
                      const selected = categories.find(c => String(c.CategoryID) === e.target.value);
                      setCategoryName(selected ? selected.Name : "");
                    }}
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
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="urdu">Urdu</option>
                    <option value="english">English</option>
                    <option value="arabic">Arabic</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </Field>

                <Field label="Writer" icon={<Users className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={writerId}
                    onChange={e => {
                      setWriterId(e.target.value);
                      const selected = writers.find(w => String(w.WriterID) === e.target.value);
                      setWriterName(selected ? selected.Name : "");
                    }}
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
                    value={groupId}
                    onChange={e => {
                      setGroupId(e.target.value);
                      const selected = groups.find(g => String(g.GroupID) === e.target.value);
                      setGroupName(selected ? selected.GroupName : "");
                    }}
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
                    value={sectionId}
                    onChange={e => {
                      setSectionId(e.target.value);
                      const selected = sections.find(s => String(s.SectionID) === e.target.value);
                      setSectionName(selected ? selected.SectionName : "");
                    }}
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
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
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
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        disabled={isSubmitting}
                      />
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" /> Featured
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => setIsSelected(e.target.checked)}
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

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Kalaam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}