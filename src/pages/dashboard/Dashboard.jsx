import React, { useState } from "react";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import { useTheme } from "@mui/material/styles";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <AdminHeader onMenuClick={handleDrawerToggle} />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0A0A0A, #101624)",
          color: "#EEEEEE",
        }}
      >
        {/* Sidebar */}
        {!isMobile && <Sidebar />}
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            ml: isMobile ? 0 : "240px",
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(16,22,36,0.9) 100%)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('/path/to/subtle-pattern.png')",
              opacity: 0.03,
              zIndex: -1,
            },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};
export default Dashboard;
