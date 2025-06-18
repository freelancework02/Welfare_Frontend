import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../component/Layout";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`https://newmmdata-backend.onrender.com/api/feedback`);
        console.log("Fetched data:", res.data);

        // Filter out deleted feedback
        const filtered = res.data.filter(item => item.isDeleted?.data?.[0] === 0);
        setFeedbacks(filtered);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-8">User Feedback</h2>

        {loading && <p className="text-center text-gray-500">Loading feedbacks...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && feedbacks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg shadow-md">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Feedback</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">{feedback.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{feedback.feedback}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{feedback.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{feedback.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{feedback.feedbackType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(feedback.createdOn).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && feedbacks.length === 0 && (
          <p className="text-center text-gray-500">No feedback found.</p>
        )}
      </div>
    </Layout>
  );
};

export default FeedbackList;
