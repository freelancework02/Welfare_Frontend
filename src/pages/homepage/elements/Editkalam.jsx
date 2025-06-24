import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Swal from 'sweetalert2';

const Editkalam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleData, setArticleData] = useState({
    title: '',
    writers: '',
    topic: '',
    language: '',
    tags: [],
    published: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'kalamPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticleData(docSnap.data());
        } else {
          Swal.fire('Not found', 'Article not found', 'error');
          navigate('/view-kalam');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        Swal.fire('Error', 'Failed to load article', 'error');
        navigate('/view-kalam');
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',') : value
    }));
  };

  const handleTogglePublished = () => {
    setArticleData(prev => ({
      ...prev,
      published: !prev.published
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'kalamPosts', id);
      await updateDoc(docRef, {
        ...articleData,
        modifiedOn: new Date(),
      });
      Swal.fire('Success', 'Article updated successfully!', 'success');
      navigate('/view-kalam');
    } catch (error) {
      console.error('Update error:', error);
      Swal.fire('Error', 'Failed to update article', 'error');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={articleData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="writers"
          value={articleData.writers}
          onChange={handleChange}
          placeholder="Writer"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="topic"
          value={articleData.topic}
          onChange={handleChange}
          placeholder="Topic"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="language"
          value={articleData.language}
          onChange={handleChange}
          placeholder="Language"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="tags"
          value={articleData.tags.join(',')}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={articleData.published}
            onChange={handleTogglePublished}
            className="mr-2"
          />
          <label>Published</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Article
        </button>
      </form>
    </div>
  );
};

export default Editkalam;
