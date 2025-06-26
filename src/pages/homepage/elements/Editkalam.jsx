// Full-featured Edit Kalam Page (mirroring Create Kalam Page)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Swal from 'sweetalert2';
import Layout from '../../../component/Layout';
import { Type, FileText, Globe, Users, Hash, CalendarIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Field = ({ label, icon, children }) => (
  <div>
    <label className="text-sm font-medium mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

export default function EditKalam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineSpacing, setLineSpacing] = useState(2);

  const [articleData, setArticleData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'kalamPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setArticleData({
            ...data,
            tags: data.tags || [],
            postUrdu: convertBRtoNewline(data.postUrdu || ''),
            postRoman: convertBRtoNewline(data.postRoman || ''),
            postEngilsh: convertBRtoNewline(data.postEngilsh || ''),
            postHindi: convertBRtoNewline(data.postHindi || ''),
            postArabic: convertBRtoNewline(data.postArabic || ''),
            postSharha: convertBRtoNewline(data.postSharha || ''),
            postTranslate: convertBRtoNewline(data.postTranslate || ''),
          });
        } else {
          Swal.fire('Not found', 'Kalam not found', 'error');
          navigate('/view-kalam');
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load Kalam', 'error');
        navigate('/view-kalam');
      }
    };
    fetchData();
  }, [id, navigate]);

  const convertBRtoNewline = (text) => text.replace(/<br\s*\/>/gi, '\n').replace(/<br>/gi, '\n');
  const convertNewlineToBR = (text) => text.split('\n\n').join('<br><br>').split('\n').join('<br>');

  const handleChange = (field) => (e) => {
    setArticleData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleTextArea = (field) => (e) => {
    const text = e.target.value;
    const lines = text.split('\n');
    if (lines[lines.length - 1] === '' && lines[lines.length - 2] === '') {
      setArticleData(prev => ({ ...prev, [field]: lines.slice(0, -1).join('\n') }));
    } else {
      setArticleData(prev => ({ ...prev, [field]: text }));
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...articleData,
        lineSetting: `${lineSpacing}line`,
        modifiedOn: serverTimestamp(),
        postUrdu: convertNewlineToBR(articleData.postUrdu || ''),
        postRoman: convertNewlineToBR(articleData.postRoman || ''),
        postEngilsh: convertNewlineToBR(articleData.postEngilsh || ''),
        postHindi: convertNewlineToBR(articleData.postHindi || ''),
        postArabic: convertNewlineToBR(articleData.postArabic || ''),
        postSharha: convertNewlineToBR(articleData.postSharha || ''),
        postTranslate: convertNewlineToBR(articleData.postTranslate || ''),
        tags: typeof articleData.tags === 'string' ? articleData.tags.split(',').map(t => t.trim()) : articleData.tags,
      };

      await updateDoc(doc(db, 'kalamPosts', id), updatedData);

      Swal.fire('Success', 'Kalam updated successfully', 'success');
      navigate('/view-kalam');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update Kalam', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Edit Kalam (ID: {id})</h1>
          <div className="bg-slate-50 rounded-lg p-8 space-y-6">
            <Field label="Title" icon={<Type className="w-4 h-4" />}>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={articleData.title || ''}
                onChange={handleChange('title')}
              />
            </Field>

            <Field label="Writer" icon={<Users className="w-4 h-4" />}>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={articleData.writer || ''}
                onChange={handleChange('writer')}
              />
            </Field>

            <Field label="Topic" icon={<FileText className="w-4 h-4" />}>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={articleData.topic || ''}
                onChange={handleChange('topic')}
              />
            </Field>

            <Field label="Language" icon={<Globe className="w-4 h-4" />}>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={articleData.language || ''}
                onChange={handleChange('language')}
              />
            </Field>

            <Field label="Tags" icon={<Hash className="w-4 h-4" />}>
              <input
                type="text"
                className="border rounded-lg p-2 w-full"
                value={(articleData.tags || []).join(', ')}
                onChange={handleChange('tags')}
              />
            </Field>

            <Field label="Description" icon={<FileText className="w-4 h-4" />}>
              <ReactQuill
                theme="snow"
                value={articleData.description || ''}
                onChange={(val) => setArticleData(prev => ({ ...prev, description: val }))}
              />
            </Field>

            {/* Line Spacing */}
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
                    />
                    {num} Line{num !== 1 ? 's' : ''}
                  </label>
                ))}
              </div>
            </Field>

            {/* Textareas for Kalam text */}
            {["postUrdu", "postRoman", "postEngilsh", "postHindi", "postArabic", "postSharha", "postTranslate"].map((field) => (
              <Field key={field} label={field} icon={<FileText className="w-4 h-4" />}>
                <textarea
                  value={articleData[field] || ''}
                  onChange={handleTextArea(field)}
                  rows={6}
                  className="border w-full p-2 rounded-lg"
                />
              </Field>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {isSubmitting ? 'Updating...' : 'Update Kalam'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
