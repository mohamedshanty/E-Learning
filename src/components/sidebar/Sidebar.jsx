import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  useMediaQuery,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LinkIcon from "@mui/icons-material/Link";
import { useTheme } from "@mui/material/styles";

const baseLink = "/dashboard";

const menuItems = [
  { text: "Users", icon: <PeopleIcon />, path: `${baseLink}/admin-users` },
  { text: "Blog", icon: <ArticleIcon />, path: `${baseLink}/admin-blogs` },
  {
    text: "Courses",
    icon: <MenuBookIcon />,
    path: `${baseLink}/admin-courses`,
  },
  { text: "Resources", icon: <LinkIcon />, path: `${baseLink}/admin-links` },
];

const SidebarContent = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: 240,
        height: "100%",
        background: "linear-gradient(180deg, #0A0A0A 0%, #101624 100%)",
        color: "white",
        p: 2,
        borderRight: "1px solid #393E46",
      }}
      onClick={onClose}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#00ADB5",
          textAlign: "center",
          pt: 2,
        }}
      >
        Admin Panel
      </Typography>

      {isMobile && (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            onClose?.();
            window.location.href = "/home";
          }}
          sx={{
            mb: 3,
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

      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            component={NavLink}
            to={path}
            sx={{
              mb: 1,
              borderRadius: 1,
              color: "#EEEEEE",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&.active": {
                backgroundColor: "rgba(0, 173, 181, 0.2)",
                color: "#00ADB5",
                borderLeft: "3px solid #00ADB5",
              },
              "&:hover": {
                backgroundColor: "rgba(57, 62, 70, 0.5)",
                color: "#00FFF0",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
              {React.cloneElement(icon, { fontSize: "small" })}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontSize: "0.95rem" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) {
    return (
      <Box
        sx={{
          width: 240,
          position: "fixed",
          height: "100vh",
          background: "linear-gradient(180deg, #0A0A0A 0%, #101624 100%)",
          color: "white",
        }}
      >
        <SidebarContent />
      </Box>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <SidebarContent onClose={handleDrawerToggle} />
    </Drawer>
  );
};

export default Sidebar;
