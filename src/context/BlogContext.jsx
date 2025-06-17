import React, { createContext, useState, useEffect, useRef } from "react";
import { blogsData } from "../data/blogsData";

export const BlogContext = createContext();

localStorage.setItem("blogs", JSON.stringify(blogsData));

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("blogs");
    if (stored) {
      setBlogs(JSON.parse(stored));
    } else {
      setBlogs(blogsData);
      localStorage.setItem("blogs", JSON.stringify(blogsData));
    }
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem("blogs", JSON.stringify(blogs));
    }
  }, [blogs]);

  const addBlog = (newBlog) => {
    setBlogs((prev) => [...prev, newBlog]);
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;
