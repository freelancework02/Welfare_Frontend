import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Layout from '../../../component/Layout';
import { ArrowLeft } from 'lucide-react';

const KalamDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'kalamPosts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="p-6 text-center text-gray-600">Article not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-8">
        <Link to="/viewkalam" className="text-blue-500 flex items-center mb-4 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Kalam List
        </Link>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="text-sm text-gray-500 mb-2">
          <span className="mr-4">Writer: {article.writers}</span>
          <span className="mr-4">Topic: {article.topic || 'N/A'}</span>
          <span className="mr-4">Language: {article.language}</span>
          <span>Status: {article.published ? 'Published' : 'Draft'}</span>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t pt-4 mt-4 prose max-w-none">
          {/* Assuming content is in article?.BlogText?.urdu and/or english */}
          {article?.BlogText?.urdu && (
            <div className="mb-4 text-right" dir="rtl">
              <div dangerouslySetInnerHTML={{ __html: article.BlogText.urdu }} />
            </div>
          )}
          {article?.BlogText?.english && (
            <div className="mb-4" dir="ltr">
              <div dangerouslySetInnerHTML={{ __html: article.BlogText.english }} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KalamDetail;
