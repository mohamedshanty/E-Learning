import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Paper, Card, Divider } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import assets from "../../assets/assets";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [coursesCount, setCoursesCount] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      try {
        setLoading(true);
        const [userDoc, profileDoc, progressDoc] = await Promise.all([
          getDoc(doc(db, "users", uid)),
          getDoc(doc(db, "profiles", uid)),
          getDoc(doc(db, "userProgress", uid)),
        ]);

        const mergedData = {};

        if (userDoc.exists()) {
          Object.assign(mergedData, userDoc.data());
          setCoursesCount(mergedData.enrolledCourses?.length || 0);
        }

        if (profileDoc.exists()) {
          Object.assign(mergedData, profileDoc.data());
        }

        setUserData(mergedData);

        if (progressDoc.exists()) {
          const progressData = progressDoc.data();
          const totalCompleted = Object.values(progressData).reduce(
            (total, course) => total + (course.completedLectures?.length || 0),
            0
          );
          setCompletedVideos(totalCompleted);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getAvatarSrc = () => {
    if (!userData) return assets.avatar_icon;

    if (userData.imageUrl && isValidImageUrl(userData.imageUrl)) {
      return userData.imageUrl;
    }

    if (userData.avatar && isValidImageUrl(userData.avatar)) {
      return userData.avatar;
    }

    return assets.avatar_icon;
  };

  const isValidImageUrl = (url) => {
    return (
      typeof url === "string" &&
      (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/"))
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        }}
      >
        <Typography color="#fff">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(18, 18, 18, 0.8)",
          borderRadius: 3,
          p: 4,
          maxWidth: "800px",
          width: "100%",
          color: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
          <Avatar
            src={getAvatarSrc()}
            sx={{
              width: 100,
              height: 100,
              border: "2px solid #2c5364",
            }}
            alt="User Avatar"
            onError={(e) => {
              e.target.src = assets.avatar_icon;
            }}
          />
          <Box>
            <Typography variant="h5">{userData?.fullName || "User"}</Typography>
            <Typography variant="body2" color="gray">
              {userData?.email}
            </Typography>
            <Typography variant="body2">
              Phone: {userData?.phone || "Not provided"}
            </Typography>
            <Typography variant="body2">
              Role: {userData?.role || "Student"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        <Box display="flex" gap={2} flexWrap="wrap">
          <Card sx={{ p: 2, flex: 1, backgroundColor: "#222", color: "white" }}>
            <Typography variant="subtitle1">Courses Enrolled</Typography>
            <Typography variant="h6">{coursesCount}</Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1, backgroundColor: "#222", color: "white" }}>
            <Typography variant="subtitle1">Videos Completed</Typography>
            <Typography variant="h6">{completedVideos}</Typography>
          </Card>
        </Box>

        <Box sx={{ mt: 2 }}>
          <CustomButton variant="outlined" to="/edit-profile">
            Edit Profile
          </CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
