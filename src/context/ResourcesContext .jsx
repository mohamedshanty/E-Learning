import React, { createContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const ResourcesContext = createContext();

export const ResourcesProvider = ({ children }) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const snapshot = await getDocs(collection(db, "resources"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResources(data);
    };

    fetchResources();
  }, []);

  const addResource = async (newResource) => {
    const docRef = await addDoc(collection(db, "resources"), newResource);
    setResources((prev) => [...prev, { id: docRef.id, ...newResource }]);
  };

  const deleteResource = async (id) => {
    await deleteDoc(doc(db, "resources", id));
    setResources((prev) => prev.filter((res) => res.id !== id));
  };

  const updateResource = async (id, updatedData) => {
    await updateDoc(doc(db, "resources", id), updatedData);
    setResources((prev) =>
      prev.map((res) => (res.id === id ? { ...res, ...updatedData } : res))
    );
  };

  return (
    <ResourcesContext.Provider
      value={{ resources, addResource, deleteResource, updateResource }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};
