// src/pages/Auth/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "../../components/customTextField/CustomTextField";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../config/firebase";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password has been reset!");
    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

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
      <Container maxWidth="sm">
        <Paper
          sx={{
            padding: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(15, 15, 15, 0.7)",
            borderRadius: 3,
            color: "white",
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Reset Your Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleReset}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <CustomTextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />

            <CustomTextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} sx={{ color: "#ddd" }} />
              }
              sx={{
                backgroundColor: "#203a43",
                color: "#ddd",
                "&:hover": {
                  backgroundColor: "#2c5364",
                },
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
