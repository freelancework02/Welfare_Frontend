import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../component/Layout";

export default function ViewBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://welfare-a0jo.onrender.com/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📄 Blog List</h1>

        {loading ? (
          <p className="text-gray-600 text-center">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-100 uppercase text-xs text-gray-600">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr key={blog.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{blog.title}</td>
                    <td className="px-6 py-4">
                      <div
                        className="line-clamp-3 prose prose-sm"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
