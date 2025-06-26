import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import assets from "../../assets/assets";
import { useTheme } from "@mui/material/styles";

const AdminHeader = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("uid"));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      try {
        const docUserRef = doc(db, "users", uid);
        const docProfileRef = doc(db, "profiles", uid);
        const [userSnap, profileSnap] = await Promise.all([
          getDoc(docUserRef),
          getDoc(docProfileRef),
        ]);

        if (userSnap.exists()) {
          const user = userSnap.data();
          const profile = profileSnap.exists() ? profileSnap.data() : {};
          const avatarUrl =
            profile.imageUrl || user.avatar || assets.avatar_icon;

          setUserData({ ...user, avatar: avatarUrl });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile-page");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        borderBottom: "1px solid rgba(57, 62, 70, 0.3)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "64px !important",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            sx={{
              display: { xs: "block", md: "none" },
              color: "#00ADB5",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#00ADB5",
              cursor: "pointer",
              "&:hover": { color: "#00FFF0" },
            }}
            onClick={() => navigate("/home")}
          >
            UniLearn
            <Box component="span" sx={{ color: "#EEEEEE", ml: 1 }}>
              Admin
            </Box>
          </Typography>
        </Box>

        {isLoggedIn && userData && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/home")}
                sx={{
                  mr: 2,
                  fontSize: "0.75rem",
                  padding: "6px 12px",
                  color: "#00ADB5",
                  borderColor: "#393E46",
                  "&:hover": {
                    borderColor: "#00ADB5",
                    backgroundColor: "rgba(0, 173, 181, 0.1)",
                  },
                }}
              >
                View Site
              </Button>
            )}

            <IconButton
              onClick={handleMenu}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 173, 181, 0.1)",
                },
              }}
            >
              <Avatar
                alt={userData.fullName || "User"}
                src={userData.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  border: "2px solid #00ADB5",
                }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e1e1e",
                  color: "#EEEEEE",
                  border: "1px solid #393E46",
                  "& .MuiMenuItem-root": {
                    "&:hover": {
                      backgroundColor: "rgba(0, 173, 181, 0.1)",
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 1, color: "#00ADB5" }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1, color: "#FF5252" }} />
                <Box component="span" sx={{ color: "#FF5252" }}>
                  Logout
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
