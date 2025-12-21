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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
} from "@mui/material";
import {
  VideoLibrary,
  AccountCircle,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import assets from "../../assets/assets";

const navigationItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "my-courses", label: "My Courses" },
  { id: "blog", label: "Blog" },
  { id: "resources", label: "Resources" },
  { id: "contact-us", label: "Contact Us" },
];

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("uid"));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }

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

          setUserData({
            ...user,
            avatar: avatarUrl,
          });
          setIsLoggedIn(true);
        } else {
          setUserData(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(null);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleClose();
    navigate("/profile-page");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    setUserData(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/home") {
      navigate(`/home#${sectionId}`);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? "rgba(18,18,18,0.9)" : "transparent",
          transition: "background-color 0.3s ease",
          boxShadow: "none",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          py: 2,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg" sx={{ padding: 0 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#00ADB5", cursor: "pointer" }}
              onClick={() => {
                if (location.pathname === "/home") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("/home");
                }
              }}
            >
              UniLearn
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    color: "#A9A9A9",
                    textTransform: "none",
                    fontSize: { md: "0.9rem", lg: "1rem" },
                    transition: "0.3s",
                    "&:hover": { color: "#00ADB5" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isLoggedIn && userData ? (
                <>
                  {userData.role === "admin" && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate("/dashboard")}
                      sx={{
                        mr: 2,
                        fontSize: "0.75rem",
                        padding: "4px 10px",
                        minWidth: "80px",
                        color: "#00ADB5",
                        borderColor: "#00ADB5",
                        display: { xs: "none", md: "inline-flex" },
                        "&:hover": {
                          borderColor: "#008C9E",
                          backgroundColor: "rgba(0, 173, 181, 0.1)",
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                  )}

                  <IconButton
                    color="inherit"
                    onClick={() => navigate("/watch-later")}
                  >
                    <VideoLibrary />
                  </IconButton>

                  <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{ display: { xs: "block", md: "none" } }}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>

                  <IconButton onClick={handleMenu} color="inherit" size="large">
                    <Avatar
                      alt={userData.fullName || "User"}
                      src={userData.avatar}
                      sx={{ width: 36, height: 36 }}
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
                </>
              ) : (
                <Button
                  variant="outlined"
                  sx={{ color: "#00ADB5", borderColor: "#00ADB5", ml: 1 }}
                  onClick={() => navigate("/")}
                >
                  Login / Sign Up
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: 12000 }}
      >
        <Box
          sx={{
            width: 250,
            bgcolor: "#121212",
            height: "100%",
            color: "white",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {userData?.role === "admin" && (
              <ListItem
                button
                onClick={() => {
                  navigate("/dashboard");
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
