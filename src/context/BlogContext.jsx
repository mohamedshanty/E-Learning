import React, { createContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort by date (newest first)
      blogList.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA;
      });
      setBlogs(blogList);
    } catch (err) {
      console.error("Error fetching blogs: ", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "blogs", id), updatedData);
      await fetchBlogs();
      return true;
    } catch (err) {
      console.error("Error updating blog: ", err);
      setError("Failed to update blog");
      return false;
    }
  };

  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      await fetchBlogs();
      return true;
    } catch (err) {
      console.error("Error deleting blog: ", err);
      setError("Failed to delete blog");
      return false;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider
      value={{ blogs, loading, error, fetchBlogs, updateBlog, deleteBlog }}
    >
      {children}
    </BlogContext.Provider>
  );
};
