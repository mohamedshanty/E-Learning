import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const CustomButton = ({ to, children, variant = "contained", ...props }) => {
  const isOutlined = variant === "outlined";
  const isLink = Boolean(to);

  return (
    <Button
      component={isLink ? Link : "button"}
      to={isLink ? to : undefined}
      {...props}
      variant={variant}
      sx={{
        px: 3,
        py: 1.5,
        fontWeight: "bold",
        fontSize: { xs: "14px", sm: "16px" },
        borderRadius: "8px",
        background: isOutlined
          ? "transparent"
          : "linear-gradient(135deg, #00adb5, #00fff0)",
        color: isOutlined ? "#00adb5" : "white",
        border: isOutlined ? "2px solid #00adb5" : "none",
        boxShadow: isOutlined ? "none" : "0px 4px 15px rgba(0, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          background: isOutlined
            ? "rgba(0,173,181,0.1)"
            : "linear-gradient(135deg, #00fff0, #00adb5)",
          boxShadow: "0px 6px 20px rgba(0, 255, 255, 0.2)",
          transform: "translateY(-2px)",
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
