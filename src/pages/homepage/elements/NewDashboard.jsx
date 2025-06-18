import React from 'react'
import Layout from '../../../component/Layout'
import { Plus, PenTool, Languages, BookOpen, FileText, UserCheck } from "lucide-react";

const NewDashboard = () => {
    const stats = [
        {
            title: "Writers",
            count: 12,
            icon: PenTool,
            iconColor: "text-amber-500",
        },
        {
            title: "Translators",
            count: 8,
            icon: Languages,
            iconColor: "text-blue-500",
        },
        {
            title: "Books",
            count: 25,
            icon: BookOpen,
            iconColor: "text-emerald-500",
        },
        {
            title: "Unicode Books",
            count: 5,
            icon: FileText,
            iconColor: "text-red-500",
        },
        {
            title: "Admins",
            count: 4,
            icon: UserCheck,
            iconColor: "text-violet-500",
        },
    ];

    const recentActivity = [
        {
            user: "Aisha Kaur",
            action: "Added New Book",
            item: "The Silent Patient",
            date: "2024-06-03",
            status: "Published",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            user: "Rohan Sharma",
            action: "Updated Article",
            item: "AI in Healthcare",
            date: "2024-06-02",
            status: "Pending Review",
            statusColor: "bg-amber-100 text-amber-700",
        },
        {
            user: "Priya Patel",
            action: "Registered Writer",
            item: "John Doe",
            date: "2024-06-01",
            status: "Active",
            statusColor: "bg-blue-100 text-blue-700",
        },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                            <h4 className="text-sm font-medium text-gray-600">{stat.title}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
                                        <button
                                            className="flex items-center px-3 py-1 text-sm font-medium text-white rounded hover:opacity-90"
                                            style={{ backgroundColor: "#5a6c17" }}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        <a href="#" className="hover:underline">
                                            View all
                                        </a>
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-white shadow-md rounded-lg">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                        </div>
                        <div className="overflow-x-auto px-6 py-4">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm text-gray-500 uppercase tracking-wide border-b">
                                        <th className="py-2">User</th>
                                        <th className="py-2">Action</th>
                                        <th className="py-2">Item</th>
                                        <th className="py-2">Date</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-200">
                                    {recentActivity.map((activity, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="py-3">{activity.user}</td>
                                            <td className="py-3">{activity.action}</td>
                                            <td className="py-3 font-medium text-gray-800">{activity.item}</td>
                                            <td className="py-3 text-gray-600">{activity.date}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${activity.statusColor}`}
                                                >
                                                    {activity.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NewDashboard