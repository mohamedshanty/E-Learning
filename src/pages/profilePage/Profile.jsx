import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Card,
  Divider,
} from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useContext } from "react";
import { CoursesContext } from "../../context/CoursesContext";

const Profile = () => {
  const { getCompletedCount } = useContext(CoursesContext);
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
            src={""}
            sx={{
              width: 100,
              height: 100,
              border: "2px solid #2c5364",
            }}
          />
          <Box>
            <Typography variant="h5">Mohamed Salem</Typography>
            <Typography variant="body2" color="gray">
              moahmed@gmail.com
            </Typography>
            <Typography variant="body2">Major: 2</Typography>
            <Typography variant="body2">Year: 2022</Typography>
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
          <CustomButton variant="outlined">Edit Profile</CustomButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
