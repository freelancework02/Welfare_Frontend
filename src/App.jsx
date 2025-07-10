import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from './component/AuthContext';
import Contactus from './pages/homepage/elements/Contactus'
import BlogDetail from './pages/homepage/elements/BlogDetail'
import ViewBlogList from "./pages/homepage/elements/ViewBlog";

const App = () => {
  return (
    // <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Contactus />} />
        <Route path="/blog" element={<BlogDetail />} />
        <Route path="/viewblog" element={<ViewBlogList />} />
          </Routes>
    </Router>
    // </AuthProvider>
  );
};

export default App;
