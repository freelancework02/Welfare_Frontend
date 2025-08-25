import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  FileText,
  LayoutDashboard
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Contact Us', icon: LayoutDashboard, path: '/' },
  { label: 'Create Blog', icon: FileText, path: '/blog' },
  { label: 'View Blog', icon: FileText, path: '/viewblog' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getCurrentPageTitle = () => {
    const currentLink = sidebarLinks.find(link => link.path === location.pathname);
    return currentLink ? currentLink.label : "Dashboard";
  };

  const storedRole = localStorage.getItem("role");


  return (
    <div className="flex h-screen w-screen text-gray-900 overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 w-64 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:shadow-none`}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-700">📊 Admin Panel</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col">
          {sidebarLinks.map(({ label, icon: Icon, path }, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(path);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-6 py-3 text-lg transition-all w-full text-left
                ${
                  location.pathname === path
                    ? "bg-indigo-100 text-indigo-700 font-semibold border-r-4 border-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800">{getCurrentPageTitle()}</h3>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-all"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                
              </div>
              <span className="hidden md:inline text-sm font-medium"> {storedRole ? storedRole : "User"}</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                 onClick={() => {
                    localStorage.removeItem("role"); // clear storage on logout
                    navigate("/login");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
