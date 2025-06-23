import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articlePosts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("No such article!");
        }
      } catch (error) {
        console.error("Error fetching article from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  if (!article) return <div className="p-6 text-center text-red-600">Article not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline text-sm"
      >
        ← Back to Articles
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{article.title}</h1>

          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full max-h-[400px] object-cover rounded-lg mb-6"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
            <div><strong className="text-gray-800">Writers:</strong> {article.writers}</div>
            <div><strong className="text-gray-800">Translator:</strong> {article.translator || '—'}</div>
            <div><strong className="text-gray-800">Language:</strong> {article.language}</div>
            <div><strong className="text-gray-800">Date:</strong> {article.createdOn?.toDate ? article.createdOn.toDate().toLocaleDateString() : '—'}</div>
            <div><strong className="text-gray-800">Views:</strong> {article.views || 0}</div>
          </div>

          <hr className="my-6 border-t border-gray-200" />

          {article?.BlogText?.english && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">📝 English Description</h2>
              <div
                className="prose max-w-none prose-blue"
                dangerouslySetInnerHTML={{ __html: article.BlogText.english }}
              />
            </div>
          )}

          {article?.BlogText?.urdu && (
            <div className="mb-6 text-right">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">📝 اردو تفصیل</h2>
              <div
                className="prose prose-sm prose-neutral prose-p:leading-relaxed max-w-none rtl"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: article.BlogText.urdu }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
