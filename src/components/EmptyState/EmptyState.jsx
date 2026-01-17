import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CustomButton from "../CustomButton/CustomButton";

const EmptyState = ({
  type = "default", // search | filters | profile
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
}) => {
  const renderIcon = () => {
    if (type === "search") return <SearchOffOutlinedIcon />;
    if (type === "filters") return <TuneOutlinedIcon />;
    return <SchoolOutlinedIcon />;
  };

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: { xs: 4, md: 6 },
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Box sx={{ fontSize: 70, color: "#00ADB5", mb: 2 }}>{renderIcon()}</Box>

        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#bbb", mb: 3 }}>
          {description}
        </Typography>

        {onAction && (
          <Button
            variant="outlined"
            color="primary"
            onClick={onAction}
            sx={{ px: 4, py: 1.2, fontWeight: 600 }}
          >
            {actionLabel}
          </Button>
        )}

        {actionTo && (
          <CustomButton
            to={actionTo}
            variant="contained"
            sx={{ px: 4, py: 1.2, fontWeight: 600 }}
          >
            {actionLabel}
          </CustomButton>
        )}
      </Box>
    </Box>
  );
};

export default EmptyState;
