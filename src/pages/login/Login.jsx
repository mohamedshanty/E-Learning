import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
// import CustomTextField from "../components/CostomTextField";
import { LoadingButton } from "@mui/lab";
import CustomTextField from "../../components/customTextField/CustomTextField";

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currState, setCurrState] = useState("Sign Up");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/profile");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            {currState === "Sign Up" ? "Sign Up" : "Login"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {currState === "Sign Up" ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <CustomTextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  // // @ts-ignore
                  // error={!!errors.firstName}
                  // // @ts-ignore
                  // helperText={errors.firstName}
                />
                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  // @ts-ignore
                  // error={!!errors.lastName}
                  // // @ts-ignore
                  // helperText={errors.lastName}
                />
              </Box>
            ) : null}

            <CustomTextField
              label="Email Address"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              // // @ts-ignore
              // error={!!errors.email}
              // // @ts-ignore
              // helperText={errors.email}
            />
            <CustomTextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
              // @ts-ignore
              // error={!!errors.password}
              // // @ts-ignore
              // helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: "#fff" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {currState === "Sign Up" ? (
              <CustomTextField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                // @ts-ignore
                // error={!!errors.confirmPassword}
                // // @ts-ignore
                // helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#fff" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              loadingIndicator={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "#ddd" }} />
                  <Typography sx={{ color: "#ddd", fontSize: 14 }}>
                    {currState === "Sign Up" ? "Signing Up..." : "Login..."}
                  </Typography>
                </Box>
              }
              sx={{
                backgroundColor: "#203a43",
                color: "#ddd",
                "&:hover": {
                  backgroundColor: "#2c5364",
                },
              }}
            >
              {currState === "Sign Up" ? "Sign Up" : "Login"}
            </LoadingButton>

            {currState === "Sign Up" ? (
              <Typography variant="body2" align="center" sx={{ color: "#ccc" }}>
                Already have an account?{" "}
                <span
                  onClick={() => setCurrState("Login")}
                  style={{ color: "#90caf9", cursor: "pointer" }}
                >
                  Sign In
                </span>
              </Typography>
            ) : (
              <Typography variant="body2" align="center" sx={{ color: "#ccc" }}>
                Create an account{" "}
                <span
                  onClick={() => setCurrState("Sign Up")}
                  style={{ color: "#90caf9", cursor: "pointer" }}
                >
                  Sign Up
                </span>
              </Typography>
            )}

            {currState === "Sign Up" ? null : (
              <Link
                to="/forget"
                style={{
                  color: "#90caf9",
                  cursor: "pointer",
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                }}
              >
                Forget Passord ?
              </Link>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
