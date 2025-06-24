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
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import Swal from "sweetalert2";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

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
  const [selectedTopic, setSelectedTopic] = useState("Naat");
  const [selectedLanguage, setSelectedLanguage] = useState("1");
  const [selectedWriter, setSelectedWriter] = useState("");
  const [publicationDate, setPublicationDate] = useState(getCurrentDate());
  const [selectedTags, setSelectedTags] = useState(["نعت"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextDocId, setNextDocId] = useState(0);

  // Text content states
  const [postUrdu, setPostUrdu] = useState("");
  const [postRoman, setPostRoman] = useState("");
  const [postEnglish, setPostEnglish] = useState("");
  const [postHindi, setPostHindi] = useState("");
  const [postArabic, setPostArabic] = useState("");
  const [postSharha, setPostSharha] = useState("");
  const [postTranslate, setPostTranslate] = useState("");
  const [lineSetting, setLineSetting] = useState("2line");
  const [style, setStyle] = useState("1");
  const [lineSpacing, setLineSpacing] = useState(2); // Number of lines between spaces

  // Get the next document ID
  useEffect(() => {
    const getNextDocId = async () => {
      try {
        const q = query(collection(db, "kalamPosts"), orderBy("book", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const lastDoc = querySnapshot.docs[0];
          const lastDocId = parseInt(lastDoc.id);
          setNextDocId(lastDocId + 1);
        } else {
          setNextDocId(684); // Starting ID if collection is empty
        }
      } catch (error) {
        console.error("Error getting next document ID:", error);
        setNextDocId(684); // Fallback starting ID
      }
    };

    getNextDocId();
  }, []);

  // Format text with line spacing
  const formatTextWithSpacing = (text) => {
    if (!text) return "";
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return "";
    
    let result = [];
    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i]);
      if ((i + 1) % lineSpacing === 0 && i !== lines.length - 1) {
        result.push(''); // Add empty line for spacing
      }
    }
    return result.join('\n');
  };

  // Handle text change with automatic spacing
  const handleTextChange = (setter) => (e) => {
    const text = e.target.value;
    const lines = text.split('\n');
    
    // If the last line is empty, it means user pressed enter twice
    if (lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
      // Remove the extra empty line to prevent double spacing
      setter(lines.slice(0, -1).join('\n'));
    } else {
      setter(text);
    }
  };

  const handleSave = async (isPublish) => {
    if (!articleTitle || !selectedWriter) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Fields",
        text: "Please fill all required fields including title and writer.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slug = articleTitle
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/--+/g, "-") // Replace multiple - with single -
        .toLowerCase();

      // Format all text fields with line spacing before saving
      const formatForSave = (text) => {
        return text.split('\n\n').join('<br><br>').split('\n').join('<br>');
      };

      const articleData = {
        book: "Bookname",
        description: description,
        language: selectedLanguage,
        lineSetting: `${lineSpacing}line`, // Update lineSetting based on spacing
        postArabic: formatForSave(postArabic),
        postEngilsh: formatForSave(postEnglish),
        postHindi: formatForSave(postHindi),
        postRoman: formatForSave(postRoman),
        postSharha: formatForSave(postSharha),
        postTranslate: formatForSave(postTranslate),
        postUrdu: formatForSave(postUrdu),
        published: isPublish,
        slug: slug,
        style: style,
        tags: selectedTags,
        title: articleTitle,
        topic: selectedTopic,
        writer: selectedWriter,
        createdOn: serverTimestamp(),
        modifiedOn: serverTimestamp(),
      };

      // Use the nextDocId as the document ID
      const docRef = doc(db, "kalamPosts", nextDocId.toString());
      await setDoc(docRef, articleData);

      Swal.fire({
        icon: "success",
        title: "Kalam Submitted",
        timer: 2000,
      });

      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error saving article:", error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong.",
      });
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
            <span className="text-foreground">Create Kalam (ID: {nextDocId})</span>
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

                <Field label="Style" icon={<FileText className="w-4 h-4" />}>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    disabled={isSubmitting}
                  >
                    <option value="1">Style 1</option>
                    <option value="2">Style 2</option>
                    <option value="3">Style 3</option>
                  </select>
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
                <Field label="Topic" icon={<FileText className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Language" icon={<Globe className="w-4 h-4" />}>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="1">Urdu</option>
                    <option value="2">English</option>
                    <option value="3">Arabic</option>
                  </select>
                </Field>

                <Field label="Writer" icon={<Users className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedWriter}
                    onChange={(e) => setSelectedWriter(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="Tags (comma-separated)"
                  icon={<Hash className="w-4 h-4" />}
                >
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    placeholder="e.g. نعت, حمد, منقبت"
                    value={selectedTags.join(", ")}
                    onChange={(e) => setSelectedTags(e.target.value.split(",").map(tag => tag.trim()))}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field
                  label="Publication Date"
                  icon={<CalendarIcon className="w-4 h-4" />}
                >
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="border rounded-lg p-2 w-full"
                    required
                    disabled={isSubmitting}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleSave(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Save as Draft"}
              </button>
              <button
                type="button"
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}