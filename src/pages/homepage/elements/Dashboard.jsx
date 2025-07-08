import React, { useState, useEffect } from "react";
import Layout from "../../../component/Layout";
import axios from "axios";
import {
  FileText,
  Users,
  List,
  Book,
  Layout as LayoutIcon,
  Folder,
  Users2,
  Hash,
  Bookmark,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    articles: 0,
    writers: 0,
    poetry: 0,
    books: 0,
    sections: 0,
    categories: 0,
    groups: 0,
    topics: 0
  });

  const [recentActivity, setRecentActivity] = useState({
    poetry: [],
    books: [],
    articles: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://updated-naatacademy.onrender.com/api/dashboard/stats");
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        // Fetch latest article
        const articlesRes = await axios.get("https://updated-naatacademy.onrender.com/api/articles");
        // Fetch latest book
        const booksRes = await axios.get("https://updated-naatacademy.onrender.com/api/books");
        // Fetch latest kalaam
        const kalaamRes = await axios.get("https://updated-naatacademy.onrender.com/api/kalaam");

        setRecentActivity({
          poetry: kalaamRes.data.data || [],
          books: booksRes.data.data || [],
          articles: articlesRes.data.data || []
        });
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchStats();
    fetchRecentActivity();
  }, []);

  const statsData = [
    {
      title: "Articles",
      count: stats.articles,
      icon: FileText,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
      route: "/addarticle"
    },
    {
      title: "Writers",
      count: stats.writers,
      icon: Users,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      route: "/addwriter"
    },
    {
      title: "Poetry",
      count: stats.poetry,
      icon: List,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      route: "/kalam"
    },
    {
      title: "Books",
      count: stats.books,
      icon: Book,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      route: "/addbook"
    },
    {
      title: "Sections",
      count: stats.sections,
      icon: LayoutIcon,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      route: "/section"
    },
    {
      title: "Categories",
      count: stats.categories,
      icon: Folder,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      route: "/category"
    },
    {
      title: "Groups",
      count: stats.groups,
      icon: Users2,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      route: "/group"
    },
    {
      title: "Topics",
      count: stats.topics,
      icon: Hash,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      route: "/topic"
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div
                      className={`p-3 rounded-full ${stat.color.replace(
                        "-500",
                        "-100"
                      )}`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stat.count}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">{stat.title}</h3>
                  <button
                    onClick={() => navigate(stat.route)}
                    className={`flex items-center justify-center w-full py-2 px-4 text-sm font-medium text-white rounded-md ${stat.color} ${stat.hoverColor} transition`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Poetry */}
              <div className="bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Latest Poetry</h3>
                  <button 
                    onClick={() => navigate('/kalam')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.poetry.length > 0 ? (
                    recentActivity.poetry.map((item, i) => (
                      <div key={i} className="border-b pb-4 last:border-b-0">
                        <h4 className="text-gray-900 font-medium mb-1">{item.Title || item.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">by {item.WriterName || item.writer?.name || 'Unknown'}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {item.CategoryName || 'Poetry'}
                          </span>
                          <span className="text-gray-500">
                            {new Date(item.CreatedOn || item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent poetry found</p>
                  )}
                </div>
              </div>

              {/* Books */}
              <div className="bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Latest Books</h3>
                  <button 
                    onClick={() => navigate('/addbook')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.books.length > 0 ? (
                    recentActivity.books.map((item, i) => (
                      <div key={i} className="border-b pb-4 last:border-b-0">
                        <h4 className="text-gray-900 font-medium mb-1">{item.title || item.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">by {item.author || item.writer?.name || 'Unknown'}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {item.category?.name || 'Book'}
                          </span>
                          <span className="text-gray-500">
                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent books found</p>
                  )}
                </div>
              </div>

              {/* Articles */}
              <div className="bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Latest Articles</h3>
                  <button 
                    onClick={() => navigate('/addarticle')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.articles.length > 0 ? (
                    recentActivity.articles.map((item, i) => (
                      <div key={i} className="border-b pb-4 last:border-b-0">
                        <h4 className="text-gray-900 font-medium mb-1">{item.title || item.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">by {item.author || item.writer?.name || 'Unknown'}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {item.category?.name || 'Article'}
                          </span>
                          <span className="text-gray-500">
                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent articles found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;