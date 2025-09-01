import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './component/AuthContext';

import Contactus from './pages/homepage/elements/Contactus';
import BlogDetail from './pages/homepage/elements/BlogDetail';
import ViewBlogList from "./pages/homepage/elements/ViewBlog";
import Login from './component/Login';
import Register from './component/Register';
import ProtectedRoute from './component/ProtectedRoute';
import Updateblog from './pages/homepage/elements/Updateblog'
import Blogview from './pages/homepage/elements/Blogview'
import AddTopic from './pages/homepage/elements/AddTopicForm'
import Addcategoryform from './pages/homepage/elements/Addcategoryform'
import TopicsView from "./pages/homepage/elements/Topicsview";
import ViewCategory from "./pages/homepage/elements/ViewCategory";

// Dummy Dashboard Page
const Dashboard = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold">Welcome to Dashboard 🎉</h1>
    <p className="mt-4">You are logged in!</p>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Contactus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            }
          />

           <Route
            path="/addtopic"
            element={
              <ProtectedRoute>
                <AddTopic />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addcategory"
            element={
              <ProtectedRoute>
                <Addcategoryform />
              </ProtectedRoute>
            }
          />

            <Route
            path="/viewtopic"
            element={
              <ProtectedRoute>
                <TopicsView />
              </ProtectedRoute>
            }
          />

            <Route
            path="/viewcategory"
            element={
              <ProtectedRoute>
                <ViewCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <Blogview />
              </ProtectedRoute>
            }
          />


            <Route
            path="/editblog/:id"
            element={
              <ProtectedRoute>
                <Updateblog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewblog"
            element={
              <ProtectedRoute>
                <ViewBlogList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
