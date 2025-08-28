import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../component/Layout";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Edit3, 
  Clock,
  Share2,
  Bookmark,
  Eye
} from "lucide-react";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
    }
  }, [blog]);

  useEffect(() => {
    if (blog && blog.description) {
      // Calculate reading time (average reading speed: 200-250 words per minute)
      const textContent = blog.description.replace(/<[^>]*>/g, '');
      const wordCount = textContent.split(/\s+/).length;
      setReadingTime(Math.max(1, Math.round(wordCount / 200)));
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://welfare-a0jo.onrender.com/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load blog post",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      setRelatedLoading(true);
      // Fetch 4 related blogs, excluding the current one
      const response = await axios.get(`https://welfare-a0jo.onrender.com/api/blogs?limit=4&offset=0`);
      
      // Filter out the current blog and get only blogs with the same topic if available
      const filteredBlogs = response.data
        .filter(relatedBlog => relatedBlog.id !== blog.id)
        .slice(0, 2); // Show only 2 related articles
      
      setRelatedBlogs(filteredBlogs);
    } catch (error) {
      console.error("Failed to fetch related blogs:", error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Blog link copied to clipboard",
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Blog Post Not Found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">The blog post you're looking for doesn't exist or may have been removed.</p>
              <button 
                onClick={() => navigate("/")} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg mb-6 transition-all shadow-sm hover:shadow-md flex items-center group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        
        {/* Blog Article */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header with title and metadata */}
          <header className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {blog.topic}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                By {blog.writername}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {formatDate(blog.created_at)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {readingTime} min read
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1.5" />
                1.2K views
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden">
            {!imageError ? (
              <img 
                src={`https://welfare-a0jo.onrender.com/api/blogs/${blog.id}/image?t=${new Date().getTime()}`} 
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Image not available</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert
                         prose-headings:text-gray-800 dark:prose-headings:text-white
                         prose-p:text-gray-600 dark:prose-p:text-gray-300
                         prose-strong:text-gray-800 dark:prose-strong:text-white
                         prose-a:text-indigo-600 dark:prose-a:text-indigo-400
                         prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-900/20
                         prose-li:text-gray-600 dark:prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </div>

          {/* Action Footer */}
          <footer className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-2">
              {/* Share button commented out as requested */}
              {/* <button 
                onClick={handleShare}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button> */}
              {/* Save button commented out as requested */}
              {/* <button className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </button> */}
            </div>
            
            <button 
              onClick={() => navigate(`/editblog/${blog.id}`)} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Post
            </button>
          </footer>
        </article>

        {/* Related Posts Section */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Related Articles
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div 
                  key={relatedBlog.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/viewblog/${relatedBlog.id}`)}
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <img 
                      src={`https://welfare-a0jo.onrender.com/api/blogs/${relatedBlog.id}/image?t=${new Date().getTime()}`} 
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center hidden">
                      <span className="text-gray-500 dark:text-gray-400">Image not available</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-full">
                        {relatedBlog.topic}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {truncateText(relatedBlog.title, 60)}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {truncateText(relatedBlog.description.replace(/<[^>]*>/g, ''), 100)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(relatedBlog.created_at)}</span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        845 views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedLoading && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="flex justify-between mt-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogView;