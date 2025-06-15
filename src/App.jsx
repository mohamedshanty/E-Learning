import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import CompleteProfile from "./pages/CompleteProfile/CompleteProfile";
import Home from "./pages/home/Home";
import Courses from "./pages/courses/Courses";
import CourseDetails from "./pages/courseDetails/CourseDetails";
import WatchLater from "./pages/watchLater/WatchLater";
import WatchLaterProvider from "./context/WatchLaterContext";
import Blog from "./pages/blog/Blog";
import BlogDetails from "./pages/blogDetails/BlogDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import ScrollToTop from "./ScrollToTop";
import BlogProvider from "./context/BlogContext";
import Profile from "./pages/profilePage/Profile";
import CoursesProvider from "./context/CoursesContext";
import Resources from "./pages/resources/Resources";
import NotFound from "./pages/notFound/NotFound";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <CoursesProvider>
        <WatchLaterProvider>
          <BlogProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/profile" element={<CompleteProfile />} />
              <Route path="/home" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile-page" element={<Profile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BlogProvider>
        </WatchLaterProvider>
      </CoursesProvider>
    </>
  );
};

export default App;
