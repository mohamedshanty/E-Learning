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
  ListItemIcon,
  ListItemText,
  Container,
  Button,
} from "@mui/material";
import {
  VideoLibrary,
  AccountCircle,
  Logout,
  Menu as MenuIcon,
  Home,
  Info,
  School,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const navigationItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "my-courses", label: "My Courses" },
  { id: "blog", label: "Blog" },
  { id: "resouces", label: "Resouces" },
  { id: "contact-us", label: "Contact Us" },
];

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    navigate("/profile-page");
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
        }}
      >
        <Container maxWidth="lg" style={{ padding: 0 }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
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

            {/* Links (hidden on small screens) */}
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

            {/* Right side icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={() => navigate("/watch-later")}
              >
                <VideoLibrary />
              </IconButton>

              {/* Hamburger menu for small screens */}
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{ display: { xs: "block", md: "none" } }}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              {/* Avatar */}
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar alt="User" src="/path-to-image.jpg" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for mobile links */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: "#121212",
            height: "100%",
            color: "white",
          }}
          role="presentation"
          // غلق الـ Drawer عند النقر على أي مكان داخل الصندوق (يمكن إزالة هذا إذا تريد فقط غلق عند اختيار رابط)
          onClick={toggleDrawer(false)}
        >
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setDrawerOpen(false); // غلق الـ Drawer عند اختيار الرابط
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
