// src/pages/Auth/ForgetPassword.jsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import CustomTextField from "../../components/customTextField/CustomTextField";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Reset Error:", error);
      toast.error("Failed to send reset email.");
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
            Forgot Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleReset}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <CustomTextField
              label="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Email"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgetPassword;
