import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Contact,
  Edit ,
  Globe ,
  Languages,
  BookMarked,
  FileText,
  CalendarDays,
  BookOpenCheck,
  HelpCircle,
  Download,
  Sliders,
  Info,
  Tags,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from "./AuthContext";
import profile from "../assets/profile.jpg";

const sidebarLinks = [
  // { label: 'Dashboard', icon: LayoutDashboard, path: '/newdashboard', roles: ['superadmin'] },
  // { label: 'Admin', icon: Contact, path: '/admin', roles: ['superadmin'] },
  // { label: 'Writers', icon: PenLine, path: '/createwriter', roles: ['superadmin'] },
  // { label: 'Writers', icon: Edit , path: '/writers', roles: ['superadmin'] },
  // { label: 'Translators', icon: Languages, path: '/translator', roles: ['superadmin'] },
  // { label: 'Languages', icon: Globe, path: '/languages', roles: ['superadmin'] },
  // { label: 'Topics', icon: BookMarked, path: '/topic', roles: ['superadmin', 'admin'] },
  // { label: 'Create Topics', icon: BookMarked, path: '/create-topic', roles: ['superadmin', 'admin'] },
  { label: 'Articles', icon: FileText, path: '/article', roles: ['admin', 'superadmin'] },
  { label: 'View Articles', icon: FileText, path: '/viewarticle', roles: ['admin', 'superadmin'] },
  // { label: 'Events', icon: CalendarDays, path: '/event', roles: ['superadmin', 'admin'] },
  // { label: 'Create Events', icon: CalendarDays, path: '/createevent', roles: ['superadmin', 'admin'] },
  // { label: 'Books', icon: BookOpenCheck, path: '/book', roles: ['superadmin', 'admin'] },
  // { label: 'Books List', icon: BookOpenCheck, path: '/booklist', roles: ['superadmin', 'admin'] },
  // { label: 'Create Questions', icon: HelpCircle, path: '/createquestion', roles: ['superadmin', 'admin'] },
  // { label: 'Questions List', icon: HelpCircle, path: '/questionlist', roles: ['superadmin', 'admin'] },
  // { label: 'Book Downloads', icon: Download, path: '/booklist', roles: ['superadmin'] },
  // { label: 'Home Books Slider', icon: Sliders, path: '/home_book_slider', roles: ['superadmin'] },
  // { label: 'About Content', icon: Info, path: '/about-content', roles: ['superadmin'] },
  // { label: 'Tags', icon: Tags, path: '/taglist', roles: ['superadmin'] },
  // { label: 'Feedback', icon: MessageCircle, path: '/feedback', roles: ['admin', 'superadmin'] },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { userRole, fname, logout, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !userRole) {
      navigate("/");
    }
  }, [loading, userRole, navigate]);

  const getCurrentPageTitle = () => {
    const currentLink = sidebarLinks.find(link => link.path === location.pathname);
    return currentLink ? currentLink.label : "Admin Panel";
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="flex h-screen w-screen text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:h-full overflow-y-auto h-screen`}>
        <div className="p-6 border-b flex justify-center items-center relative">
          <img src="https://static.wixstatic.com/media/562b73_6721f8c4e1584270a7ed8b4d316ef75e~mv2.png/v1/fill/w_75,h_75,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/562b73_6721f8c4e1584270a7ed8b4d316ef75e~mv2.png" alt="Admin Panel" className="object-contain w-40 h-12" />
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 md:hidden">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <nav className="flex flex-col mt-2">
          {sidebarLinks
            .filter(link => link.roles.includes(userRole))
            .map(({ label, icon: Icon, path }, idx) => (
              <a
                key={idx}
                href={path}
                className={`flex items-center gap-3 px-6 py-3 text-lg transition-all
                ${location.pathname === path
                    ? "bg-[#fefee6] border-r-2 border-[#5c5a00] text-[#5c5a00] font-semibold"
                    : "text-[#5c5a00] hover:bg-[#f0f0d0] hover:text-black"
                  }
                `}
              >
                <Icon className="w-7 h-7" />
                {label}
              </a>
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
              <img
                src={profile}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{fname} ({userRole})</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 rounded-tl-3xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
