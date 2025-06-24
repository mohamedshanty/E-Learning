import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Avatar, Paper, Card, Divider } from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import { CoursesContext } from "../../context/CoursesContext";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import assets from "../../assets/assets";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { getCompletedCount } = useContext(CoursesContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      try {
        const userRef = doc(db, "users", uid);
        const profileRef = doc(db, "profiles", uid);

        const [userSnap, profileSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(profileRef),
        ]);

        if (userSnap.exists() && profileSnap.exists()) {
          setUserData({
            ...userSnap.data(),
            ...profileSnap.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
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
            src={userData.imageUrl || assets.avatar_icon}
            sx={{
              width: 100,
              height: 100,
              border: "2px solid #2c5364",
            }}
          />
          <Box>
            <Typography variant="h5">{userData.fullName || "User"}</Typography>
            <Typography variant="body2" color="gray">
              {userData.email}
            </Typography>
            <Typography variant="body2">Phone: {userData.phone}</Typography>
            <Typography variant="body2">
              Academic Year: {userData.year}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        <Box display="flex" gap={2} flexWrap="wrap">
          <Card sx={{ p: 2, flex: 1, backgroundColor: "#222", color: "white" }}>
            <Typography>Courses Enrolled</Typography>
            <Typography variant="h6">6</Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1, backgroundColor: "#222", color: "white" }}>
            <Typography>Videos Completed</Typography>
            <Typography variant="h6">{getCompletedCount()}</Typography>
          </Card>
        </Box>

        <Box sx={{ mt: 2 }}>
          <CustomButton variant="outlined" to="/complete-profile">
            Edit Profile
          </CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
