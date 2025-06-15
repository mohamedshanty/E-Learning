import React, { createContext, useEffect, useState } from "react";

export const WatchLaterContext = createContext();

export const WatchLaterProvider = ({ children }) => {
  const [watchLaterVideos, setWatchLaterVideos] = useState(() => {
    const saved = localStorage.getItem("watchLater");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLaterVideos));
  }, [watchLaterVideos]);

  const addToWatchLater = (video) => {
    const exists = watchLaterVideos.some(
      (v) => v.id === video.id && v.courseId === video.courseId
    );
    if (!exists) {
      setWatchLaterVideos((prev) => [...prev, video]);
    }
  };

  const removeFromWatchLater = (videoId, courseId) => {
    setWatchLaterVideos((prev) =>
      prev.filter((v) => !(v.id === videoId && v.courseId === courseId))
    );
  };

  return (
    <WatchLaterContext.Provider
      value={{ watchLaterVideos, addToWatchLater, removeFromWatchLater }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
};

export default WatchLaterProvider;
