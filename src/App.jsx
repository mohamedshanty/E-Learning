import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import CompleteProfile from "./pages/completeProfile/CompleteProfile";
import Home from "./pages/home/Home";
import Courses from "./pages/courses/Courses";
import CourseDetails from "./pages/courseDetails/CourseDetails";
import WatchLater from "./pages/watchLater/WatchLater";
import WatchLaterProvider from "./context/WatchLaterContext";
import Blog from "./pages/blog/Blog";
import BlogDetails from "./pages/blogDetails/BlogDetails";
import ScrollToTop from "./ScrollToTop";
import { BlogProvider } from "./context/BlogContext";
import Profile from "./pages/profilePage/Profile";
import CoursesProvider from "./context/CoursesContext";
import Resources from "./pages/resources/Resources";
import NotFound from "./pages/notFound/NotFound";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminWelcom from "./components/adminWelcome/AdminWelcom";
import AdminUsers from "./components/adminUsers/AdminUsers";
import AdminCourses from "./components/adminCourses/AdminCourses";
import AdminLinks from "./components/adminLinks/AdminLinks";
import AdminBlogs from "./components/adminBlogs/AdminBlogs";
import AdminResources from "./components/adminResources/AdminResources";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import { ResourcesProvider } from "./context/ResourcesContext ";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <CoursesProvider>
        <WatchLaterProvider>
          <BlogProvider>
            <ResourcesProvider>
              <ScrollToTop />
              <Routes>
                {/* إعادة توجيه من "/" إلى صفحة تسجيل الدخول */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* صفحة تسجيل الدخول بدون حماية */}
                <Route path="/login" element={<Login />} />

                {/* جميع الصفحات محمية */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <CompleteProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watch-later"
                  element={
                    <ProtectedRoute>
                      <WatchLater />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <ProtectedRoute>
                      <Blog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog/:id"
                  element={
                    <ProtectedRoute>
                      <BlogDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile-page"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <Resources />
                    </ProtectedRoute>
                  }
                />

                {/* صفحة dashboard محمية ويجب أن يكون دور المستخدم admin */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminWelcom />} />
                  <Route path="admin-users" element={<AdminUsers />} />
                  <Route path="admin-courses" element={<AdminCourses />} />
                  <Route path="admin-links" element={<AdminLinks />} />
                  <Route path="admin-blogs" element={<AdminBlogs />} />
                  <Route path="admin-resources" element={<AdminResources />} />
                </Route>

                {/* صفحة 404 محمية */}
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ResourcesProvider>
          </BlogProvider>
        </WatchLaterProvider>
      </CoursesProvider>
    </AuthProvider>
  );
};

export default App;
