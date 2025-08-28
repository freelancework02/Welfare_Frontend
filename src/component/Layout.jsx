import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  MessageSquare,
  ChevronDown,
  Sun,
  Moon,
  Search,
  Bell,
  Settings
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Create Blog", icon: FileText, path: "/blog" },
  { label: "View Blog", icon: MessageSquare, path: "/viewblog" },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getCurrentPageTitle = () => {
    const currentLink = sidebarLinks.find(
      (link) => link.path === location.pathname
    );
    return currentLink ? currentLink.label : "Dashboard";
  };

  const storedRole = localStorage.getItem("role");

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 w-72 h-screen bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Admin Panel
            </h2>
            <p className="text-indigo-200 text-xs mt-1">Content Management System</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:bg-indigo-700 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-8 flex-1 flex flex-col px-4">
          {sidebarLinks.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => {
                navigate(path);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-5 py-3.5 text-base transition-all w-full text-left rounded-xl mb-2
                ${
                  location.pathname === path
                    ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-200 font-semibold shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-300"
                }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
            <span>v1.2.0</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className={`flex items-center justify-between bg-white dark:bg-gray-800 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 transition-all duration-300 z-30
          ${isScrolled ? "shadow-md" : "shadow-sm"}`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            {/* Search bar */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification and settings */}
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-sm transition-all"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold border border-white/30">
                  {storedRole ? storedRole[0].toUpperCase() : "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  {storedRole ? storedRole : "User"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {profileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{storedRole ? storedRole : "User"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>
                    <div className="p-2">
                      <button className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem("role");
                          navigate("/login");
                        }}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb and title */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getCurrentPageTitle()}</h1>
          <nav className="flex text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-indigo-600 dark:text-indigo-400">{getCurrentPageTitle()}</span>
          </nav>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-800">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;