import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../component/Layout';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function KalamDetail() {
  const { id } = useParams();
  const [kalam, setKalam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKalam = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://updated-naatacademy.onrender.com/api/kalaam/${id}`);
        setKalam(response.data);
      } catch (err) {
        setError("Failed to fetch kalam");
        Swal.fire("Error", "Failed to fetch kalam", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchKalam();
  }, [id]);

  // Function to format poetic content with proper line breaks
  const formatPoeticContent = (content) => {
    if (!content) return '<em>No content available</em>';
    
    // Replace single line breaks with <br>, double line breaks with </p><p>
    let formatted = content
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\n\n+/g, '</p><p>')  // Multiple newlines become paragraph breaks
      .replace(/\n/g, '<br>'); // Single newlines become line breaks
    
    // Ensure we have proper paragraph tags
    if (!formatted.startsWith('<p>')) formatted = `<p>${formatted}`;
    if (!formatted.endsWith('</p>')) formatted = `${formatted}</p>`;
    
    return formatted;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </Layout>
    );
  }

  if (!kalam) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-4 md:p-8 mt-4 md:mt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors duration-200"
        >
          ← Back
        </button>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-800">{kalam.Title}</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-600 text-sm">
            <span>By <span className="font-semibold text-gray-800">{kalam.WriterName || '-'}</span></span>
            <span>Category: <span className="font-semibold text-gray-800">{kalam.CategoryName || '-'}</span></span>
            {kalam.GroupName && <span>Group: <span className="font-semibold text-gray-800">{kalam.GroupName}</span></span>}
            {kalam.SectionName && <span>Section: <span className="font-semibold text-gray-800">{kalam.SectionName}</span></span>}
          </div>
        </div>

        {kalam.ThumbnailURL && (
          <div className="flex justify-center mb-8">
            <img
              src={kalam.ThumbnailURL}
              alt={kalam.Title}
              className="rounded-lg shadow-md max-h-80 object-contain"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-8">
          {/* Urdu Content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Content (Urdu)</h2>
            <div 
              className="text-lg leading-relaxed border rounded-lg p-4 md:p-6 bg-gray-50 min-h-32"
              dir="rtl"
              style={{
                fontFamily: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif",
                lineHeight: '2.5',
                fontSize: '1.2rem'
              }}
              dangerouslySetInnerHTML={{ __html: formatPoeticContent(kalam.ContentUrdu) }}
            />
          </div>

          {/* English Content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Content (English)</h2>
            <div 
              className="text-lg leading-relaxed border rounded-lg p-4 md:p-6 bg-gray-50 min-h-32"
              style={{ lineHeight: '2' }}
              dangerouslySetInnerHTML={{ __html: formatPoeticContent(kalam.ContentEnglish) }}
            />
          </div>
        </div>

        <div className="text-right text-gray-500 text-xs mt-8 pt-4 border-t border-gray-200">
          {kalam.CreatedOn && (
            <span>Created On: {new Date(kalam.CreatedOn).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          )}
        </div>
      </div>
    </Layout>
  );
}