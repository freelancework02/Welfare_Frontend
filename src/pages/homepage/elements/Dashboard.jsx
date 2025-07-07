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

const recentActivity = {
  poetry: [
    {
      title: "Manqabat Imam Ali (AS)",
      author: "Syed Naseer-uddin-Naseer",
      date: "11/4/2023",
      category: "Manqabat",
    },
    {
      title: "Tu Hi Malik e Bahr o Bar Hai",
      author: "Behzad Lakhnavi",
      date: "11/3/2023",
      category: "Hamd",
    },
  ],
  books: [
    {
      title: "Kulliyat-e-Iqbal",
      author: "Allama Iqbal",
      date: "10/28/2023",
      category: "Naat",
    },
  ],
  articles: [
    {
      title: "The Philosophy of Khudi",
      author: "Allama Iqbal",
      date: "10/30/2023",
      category: "Naat",
    },
    {
      title: "Adab-e-Naat",
      author: "Ahmed Raza Khan Barelvi",
      date: "10/29/2023",
      category: "Naat",
    },
  ],
};

const Dashboard = () => {
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

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Articles",
      count: stats.articles,
      icon: FileText,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
    },
    {
      title: "Writers",
      count: stats.writers,
      icon: Users,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      title: "Poetry",
      count: stats.poetry,
      icon: List,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      title: "Books",
      count: stats.books,
      icon: Book,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      title: "Sections",
      count: stats.sections,
      icon: LayoutIcon,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
    {
      title: "Categories",
      count: stats.categories,
      icon: Folder,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
    },
    {
      title: "Groups",
      count: stats.groups,
      icon: Users2,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
    },
    {
      title: "Topics",
      count: stats.topics,
      icon: Hash,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
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
                  <button className="text-blue-600 text-sm font-medium">View All →</button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.poetry.map((item, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0">
                      <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">by {item.author}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{item.category}</span>
                        <span className="text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Books */}
              <div className="bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Latest Books</h3>
                  <button className="text-blue-600 text-sm font-medium">View All →</button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.books.map((item, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0">
                      <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">by {item.author}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{item.category}</span>
                        <span className="text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Articles */}
              <div className="bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Latest Articles</h3>
                  <button className="text-blue-600 text-sm font-medium">View All →</button>
                </div>
                <div className="p-6 space-y-4">
                  {recentActivity.articles.map((item, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0">
                      <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">by {item.author}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">{item.category}</span>
                        <span className="text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  ))}
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
