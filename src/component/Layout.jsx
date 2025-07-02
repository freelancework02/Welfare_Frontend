import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "./AuthContext";
import { Menu, X, FileText, BookMarked, PenLine } from 'lucide-react';


const sidebarLinks = [
  { label: 'Articles', icon: FileText, path: '/' },
  { label: 'View Articles', icon: FileText, path: '/viewarticle' },
  { label: 'Add Kalam', icon: PenLine, path: '/kalam' },
  { label: 'View Kalam', icon: PenLine, path: '/viewkalam' },
  { label: 'Create Topic', icon: BookMarked, path: '/topic' },
  { label: 'View Topics', icon: BookMarked, path: '/viewtopics' },
  { label: 'Add Language', icon: BookMarked, path: '/addlang' },
  { label: 'View Language', icon: BookMarked, path: '/viewlang' },
  { label: 'Add Book', icon: BookMarked, path: '/addbook' },
  { label: 'View Book', icon: BookMarked, path: '/viewbook' },
  { label: 'Writers', icon: BookMarked, path: '/writers' },
  { label: 'Add Section', icon: BookMarked, path: '/section' },
  { label: 'Add Group', icon: BookMarked, path: '/group' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // const { logout, loading, user } = useAuth();

  // if (loading) return <div className="p-6 text-center">Loading...</div>;

  const getCurrentPageTitle = () => {
    const currentLink = sidebarLinks.find(link => link.path === location.pathname);
    return currentLink ? currentLink.label : "Dashboard";
  };

  return (
    <div className="flex h-screen w-screen text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:h-full overflow-y-auto h-screen`}>
        <div className="p-6 border-b flex justify-center items-center relative">
          <h2 className="text-xl font-bold">Content Manager</h2>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 md:hidden">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <nav className="flex flex-col mt-2">
          {sidebarLinks.map(({ label, icon: Icon, path }, idx) => (
            <button
              key={idx}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-6 py-3 text-lg transition-all w-full text-left
                ${location.pathname === path
                  ? "bg-[#fefee6] border-r-2 border-[#5c5a00] text-[#5c5a00] font-semibold"
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

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between bg-white border-b px-6 py-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h3 className="text-xl font-semibold text-gray-700">{getCurrentPageTitle()}</h3>
          </div>
          
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              O
              </div>
              <span className="text-sm font-medium">Owais Rizvi</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;