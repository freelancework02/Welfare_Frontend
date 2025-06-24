import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../component/Layout';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Swal from 'sweetalert2';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    writers: '',
    translator: '',
    language: '',
    BlogText: {
      english: '',
      urdu: ''
    },
    published: false
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articlePosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setArticle(data);
          setForm({
            title: data.title || '',
            writers: data.writers || '',
            translator: data.translator || '',
            language: data.language || '',
            BlogText: {
              english: data.BlogText?.english || '',
              urdu: data.BlogText?.urdu || ''
            },
            published: data.published || false
          });
        } else {
          Swal.fire('Error', 'Article not found', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Could not fetch article', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('BlogText.')) {
      const lang = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        BlogText: {
          ...prev.BlogText,
          [lang]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.writers.trim()) {
      Swal.fire('Validation Error', 'Title and Writers are required', 'warning');
      return;
    }

    try {
      const docRef = doc(db, 'articlePosts', id);
      await updateDoc(docRef, {
        ...form,
        modifiedOn: serverTimestamp()
      });
      Swal.fire('Success', 'Article updated successfully!', 'success').then(() => {
        navigate('/viewarticle'); // or wherever your list route is
      });
    } catch (error) {
      console.error('Update failed:', error);
      Swal.fire('Error', 'Failed to update article', 'error');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">Loading article data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded mt-8">
        <h2 className="text-2xl font-bold mb-6">Edit Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Writers</label>
            <input
              type="text"
              name="writers"
              value={form.writers}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Translators</label>
            <input
              type="text"
              name="translator"
              value={form.translator}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Language</label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">English Description</label>
            <textarea
              name="BlogText.english"
              value={form.BlogText.english}
              onChange={handleChange}
              className="w-full p-2 border rounded h-28"
            />
          </div>

          <div>
            <label className="block font-medium">Urdu Description</label>
            <textarea
              name="BlogText.urdu"
              value={form.BlogText.urdu}
              onChange={handleChange}
              className="w-full p-2 border rounded h-28 text-right"
              dir="rtl"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              id="published"
            />
            <label htmlFor="published">Published</label>
          </div>

          <div className="mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Article
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditArticle;
