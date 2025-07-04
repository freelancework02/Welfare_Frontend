import { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ImageIcon,
  Type,
  FileText,
  Users,
  Globe,
  Hash,
  Layers,
  Grid,
} from "lucide-react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import Layout from '../../../component/Layout'

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

function Field({ label, icon, children, required }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [writerId, setWriterId] = useState("");
  const [writerName, setWriterName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [contentUrdu, setContentUrdu] = useState("");
  const [contentEnglish, setContentEnglish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [writers, setWriters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);
  const [topics, setTopics] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    // Fetch article data
    const fetchArticleData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the article
        const articleResponse = await axios.get(`http://localhost:5000/api/articles/${id}`);
        const article = articleResponse.data;
        
        // Set all the article fields
        setTitle(article.Title || "");
        setWriterId(article.WriterID ? String(article.WriterID) : "");
        setWriterName(article.WriterName || "");
        setCategoryId(article.CategoryID ? String(article.CategoryID) : "");
        setCategoryName(article.CategoryName || "");
        setGroupId(article.GroupID ? String(article.GroupID) : "");
        setGroupName(article.GroupName || "");
        setSectionId(article.SectionID ? String(article.SectionID) : "");
        setSectionName(article.SectionName || "");
        setTopicName(article.Topic || article.TopicName || "");
        setThumbnailURL(article.ThumbnailURL || "");
        setContentUrdu(article.ContentUrdu || "");
        setContentEnglish(article.ContentEnglish || "");
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load article data. Please try again.",
        }).then(() => {
          navigate('/articles');
        });
      }
    };

    // Fetch dropdown data
    const fetchDropdownData = async () => {
      try {
        // Fetch writers
        const writersRes = await axios.get("https://naatacadmey.onrender.com/api/writers");
        setWriters(writersRes.data);
        
        // Fetch categories
        const categoriesRes = await axios.get("https://naatacadmey.onrender.com/api/categories");
        setCategories(categoriesRes.data);
        
        // Fetch groups
        const groupsRes = await axios.get("https://naatacadmey.onrender.com/api/groups");
        setGroups(groupsRes.data);
        
        // Fetch sections
        const sectionsRes = await axios.get("https://naatacadmey.onrender.com/api/sections");
        setSections(sectionsRes.data);
        
        // Fetch topics
        const topicsRes = await axios.get("https://naatacadmey.onrender.com/api/topics");
        setTopics(topicsRes.data);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        // We'll still proceed even if dropdown data fails to load
      }
    };

    fetchArticleData();
    fetchDropdownData();
  }, [id, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const previewURL = URL.createObjectURL(file);
    setThumbnailURL(previewURL);
  };

  const handleUpdate = async (publish = true) => {
    try {
      setIsSubmitting(true);
      let finalThumbnailURL = thumbnailURL;

      // If there's a new image to upload
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
          const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          finalThumbnailURL = uploadResponse.data.imageUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          Swal.fire({
            icon: "error",
            title: "Image Upload Failed",
            text: "Failed to upload image. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate required fields
      if (!title.trim() || !writerId || !categoryId || !topicName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Fields",
          text: "Please fill all required fields (Title, Writer, Category, and Topic).",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare article data
      const articleData = {
        Title: title,
        WriterID: parseInt(writerId),
        WriterName: writerName,
        CategoryID: parseInt(categoryId),
        CategoryName: categoryName,
        ThumbnailURL: finalThumbnailURL,
        ContentUrdu: contentUrdu,
        ContentEnglish: contentEnglish,
        GroupID: groupId ? parseInt(groupId) : null,
        GroupName: groupName,
        SectionID: sectionId ? parseInt(sectionId) : null,
        SectionName: sectionName,
        Topic: topicName,
        TopicName: topicName
      };

      console.log('Sending article update data:', articleData);

      // Update article
      const response = await axios.put(`http://localhost:5000/api/articles/${id}`, articleData);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Article updated successfully!",
          timer: 2000
        }).then(() => {
          navigate('/articles');
        });
      } else {
        throw new Error(response.data.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Something went wrong while updating the article.';

      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;

        if (error.response.data.sqlError) {
          console.error('SQL Error:', error.response.data.sqlError);
          if (error.response.data.sqlError.includes("doesn't exist")) {
            errorMessage = "Database configuration error. Please contact support.";
          }
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article data...</p>
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
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link to="/articles" className="hover:text-foreground">
              Articles
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">Edit Article</span>
          </nav>

          <h1 className="text-2xl font-bold mb-8">Edit Article</h1>

          <div className="bg-slate-50 rounded-lg p-8">
            <section className="mb-6">
              <Field label="Thumbnail Image" icon={<ImageIcon className="w-4 h-4" />}>
                <div className="max-w-md">
                  <div
                    className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {thumbnailURL ? (
                      <img
                        src={thumbnailURL}
                        alt="Thumbnail Preview"
                        className="w-60 h-60 object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <div className="w-16 h-16 mb-4 text-muted-foreground">
                          <ImageIcon className="w-full h-full" />
                        </div>
                        <p className="text-base mb-1">Drop your image or click to browse</p>
                        <p className="text-sm text-muted-foreground mb-4">PNG, JPG, GIF (max 5MB)</p>
                        <button
                          type="button"
                          className="border px-4 py-2 rounded-md text-sm bg-transparent border-gray-400 hover:border-gray-500"
                        >
                          Browse Files
                        </button>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </Field>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Field
                  label="Article Title"
                  icon={<Type className="w-4 h-4" />}
                  required
                >
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="border rounded-lg p-2 w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="English Content"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={contentEnglish}
                    onChange={setContentEnglish}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    readOnly={isSubmitting}
                  />
                </Field>

                <Field
                  label="Urdu Content"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={contentUrdu}
                    onChange={setContentUrdu}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    style={{ direction: "rtl", textAlign: "right" }}
                    readOnly={isSubmitting}
                  />
                </Field>
              </div>

              <div className="space-y-6">
                <Field
                  label="Writer"
                  icon={<Users className="w-4 h-4" />}
                  required
                >
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
                <Field
                  label="Category"
                  icon={<Grid className="w-4 h-4" />}
                  required
                >
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
                <Field
                  label="Group"
                  icon={<Layers className="w-4 h-4" />}
                >
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
                <Field
                  label="Section"
                  icon={<Grid className="w-4 h-4" />}
                >
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
                <Field label="Topic" icon={<Hash className="w-4 h-4" />} required>
                  <select
                    className="border rounded-lg p-2 w-full"
                    value={topicName}
                    onChange={e => {
                      setTopicName(e.target.value);
                    }}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Topic</option>
                    {topics.map(topic => (
                      <option key={topic.TopicID} value={topic.Title}>
                        {topic.Title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleUpdate(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Save as Draft"}
              </button>
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleUpdate(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Article"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}