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
  const [englishDescription, setEnglishDescription] = useState("");
  const [urduDescription, setUrduDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedWriter, setSelectedWriter] = useState("");
  const [selectedTranslator, setSelectedTranslator] = useState("");
  const [writerDesignation, setWriterDesignation] = useState("");
  const [publicationDate, setPublicationDate] = useState(getCurrentDate());
  const [selectedTags, setSelectedTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for line spacing and text contents
  const [lineSpacing, setLineSpacing] = useState("1");
  const [rawTextContents, setRawTextContents] = useState({
    urdu: "",
    roman: "",
    english: "",
    hindi: "",
    arabic: "",
    sharha: ""
  });
  const [displayTextContents, setDisplayTextContents] = useState({
    urdu: "",
    roman: "",
    english: "",
    hindi: "",
    arabic: "",
    sharha: ""
  });

  // Update displayed text whenever raw text or line spacing changes
  useEffect(() => {
    const formattedContents = {};
    for (const [lang, text] of Object.entries(rawTextContents)) {
      formattedContents[lang] = formatTextWithLineSpacing(text);
    }
    setDisplayTextContents(formattedContents);
  }, [rawTextContents, lineSpacing]);

  const handleTextChange = (language, value) => {
    setRawTextContents(prev => ({
      ...prev,
      [language]: value
    }));
  };

  const formatTextWithLineSpacing = (text) => {
    if (!text) return "";

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const spacing = parseInt(lineSpacing);

    if (spacing === 1) return text;

    let result = [];
    for (let i = 0; i < lines.length; i += spacing) {
      const chunk = lines.slice(i, i + spacing).join('\n');
      result.push(chunk);
      if (i + spacing < lines.length) {
        result.push('\n\n'); // Add double line break between chunks
      }
    }

    return result.join('');
  };


  function generateSearchKey(...fields) {
    const keys = new Set();

    const addSubstrings = (s) => {
      s = s.replace(/\s+/g, '').toLowerCase();
      for (let i = 1; i <= s.length; i++) {
        keys.add(s.substring(0, i));
      }
    };

    fields.forEach(field => {
      if (field) addSubstrings(field);
    });

    return Array.from(keys);
  }


  const handleSave = async (isPublish) => {
    if (!articleTitle || !selectedLanguage || !selectedWriter) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Fields",
        text: "Please fill all required fields including title, language, and writer.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = selectedTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Format all text contents with selected line spacing for saving
      const formattedContents = {};
      for (const [lang, text] of Object.entries(rawTextContents)) {
        formattedContents[lang] = formatTextWithLineSpacing(text).replace(/\n\n/g, '<br><br>');
      }

      const searchKeys = generateSearchKey(articleTitle, selectedWriter, ...tagsArray);


      const articleData = {
        slug: articleTitle.toLowerCase().replace(/\s+/g, "-"),
        createdOn: serverTimestamp(),
        modifiedOn: serverTimestamp(),
        title: articleTitle,
        published: isPublish,
        writers: selectedWriter,
        BlogText: {
          english: englishDescription,
          urdu: urduDescription,
          ...formattedContents
        },
        topic: selectedTopic,
        tags: tagsArray,
        language: selectedLanguage,
        lineSpacing: lineSpacing,
        searchKeys
      };

      const docRef = await addDoc(collection(db, "kalamPosts"), articleData);

      await setDoc(doc(db, "kalamPosts", docRef.id), {
        ...articleData,
        docId: docRef.id,
      });

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
                  label="English Description"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={englishDescription || ""}
                    onChange={setEnglishDescription}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    readOnly={isSubmitting}
                  />
                </Field>

                <Field
                  label="Urdu Description"
                  icon={<FileText className="w-4 h-4" />}
                >
                  <ReactQuill
                    theme="snow"
                    value={urduDescription || ""}
                    onChange={setUrduDescription}
                    modules={modules}
                    formats={formats}
                    className="bg-white border rounded-lg min-h-[136px]"
                    style={{ direction: "rtl", textAlign: "right" }}
                    placeholder="اردو تفصیل یہاں درج کریں"
                    readOnly={isSubmitting}
                  />
                </Field>

                {/* Line spacing radio buttons */}
                <Field label="Post Line Setting" icon={<FileText className="w-4 h-4" />}>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <label key={num} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="lineSpacing"
                          value={num}
                          checked={lineSpacing === num.toString()}
                          onChange={() => setLineSpacing(num.toString())}
                          disabled={isSubmitting}
                        />
                        {num} Line{num !== 1 ? 's' : ''}
                      </label>
                    ))}
                  </div>
                </Field>

                {/* Language textareas */}
                <Field label="Post Language 1 - Urdu" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.urdu}
                    onChange={(e) => handleTextChange('urdu', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Language 2 - Roman" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.roman}
                    onChange={(e) => handleTextChange('roman', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Language 3 - English" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.english}
                    onChange={(e) => handleTextChange('english', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Language 4 - Hindi" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.hindi}
                    onChange={(e) => handleTextChange('hindi', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Language 5 - Arabic" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.arabic}
                    onChange={(e) => handleTextChange('arabic', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
                    style={{ direction: 'rtl' }}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field label="Post Language 6 - Sharha" icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    value={displayTextContents.sharha}
                    onChange={(e) => handleTextChange('sharha', e.target.value)}
                    cols="30"
                    rows="5"
                    className="border w-full p-2 rounded-lg"
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
                    <option value="">Select language</option>
                    {["Urdu", "Roman", "English"].map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
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

                <Field label="Translator" icon={<Users className="w-4 h-4" />}>
                  <input
                    type="text"
                    className="border rounded-lg p-2 w-full"
                    value={selectedTranslator}
                    onChange={(e) => setSelectedTranslator(e.target.value)}
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
                    placeholder="e.g. politics, technology, health"
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(e.target.value)}
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