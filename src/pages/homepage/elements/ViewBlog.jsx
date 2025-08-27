// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Layout from "../../../component/Layout";

// export default function ViewBlogList() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get("https://welfare-a0jo.onrender.com/api/blogs")
//       .then((res) => setBlogs(res.data))
//       .catch((err) => {
//         console.error("Failed to fetch blogs:", err);
//         setBlogs([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <Layout>
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">📄 Blog List</h1>

//         {loading ? (
//           <p className="text-gray-600 text-center">Loading blogs...</p>
//         ) : blogs.length === 0 ? (
//           <p className="text-center text-gray-500">No blogs found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
//             <table className="min-w-full text-sm text-left text-gray-800">
//               <thead className="bg-gray-100 uppercase text-xs text-gray-600">
//                 <tr>
//                   <th className="px-6 py-4">#</th>
//                   <th className="px-6 py-4">Title</th>
//                   <th className="px-6 py-4">Description</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {blogs.map((blog, index) => (
//                   <tr key={blog.id} className="border-b hover:bg-gray-50">
//                     <td className="px-6 py-4">{index + 1}</td>
//                     <td className="px-6 py-4 font-medium">{blog.title}</td>
//                     <td className="px-6 py-4">
//                       <div
//                         className="line-clamp-3 prose prose-sm"
//                         dangerouslySetInnerHTML={{ __html: blog.description }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../component/Layout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ViewBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    axios.get("https://welfare-a0jo.onrender.com/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://welfare-a0jo.onrender.com/api/blogs/${id}`)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Your blog has been deleted.',
              'success'
            );
            fetchBlogs(); // Refresh the list
          })
          .catch((err) => {
            console.error("Failed to delete blog:", err);
            Swal.fire(
              'Error!',
              'Failed to delete the blog.',
              'error'
            );
          });
      }
    });
  };

  const handleView = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/editblog/${id}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📄 Blog List</h1>
          <button 
            onClick={() => navigate('/createblog')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            + Add New Blog
          </button>
        </div>

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
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Writer</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr key={blog.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{blog.title}</td>
                    <td className="px-6 py-4">{blog.topic}</td>
                    <td className="px-6 py-4">{blog.writername}</td>
                    <td className="px-6 py-4">
                      <div
                        className="line-clamp-3 prose prose-sm max-w-md"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleView(blog.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                          title="View"
                        >
                         View
                        </button>
                        <button
                          onClick={() => handleEdit(blog.id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
                          title="Edit"
                        >
                         Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
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