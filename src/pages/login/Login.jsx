import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import CustomTextField from "../../components/customTextField/CustomTextField";
import { login, signup } from "../../config/firebase";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currState, setCurrState] = useState("Sign Up");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currState === "Login") {
        await login(formData.email, formData.password);
        navigate("/home");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        await signup(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          formData.role
        );
        navigate("/profile");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
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
            {currState === "Sign Up" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <CustomTextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Box>
            )}

            <CustomTextField
              label="Email Address"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
            <CustomTextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleChange}
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

            {currState === "Sign Up" && (
              <CustomTextField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
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
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
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
              {loading ? (
                <Typography sx={{ color: "#ddd", fontSize: 14 }}>
                  {currState === "Sign Up" ? "Sign Up..." : "Login..."}
                </Typography>
              ) : currState === "Sign Up" ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </Button>

            <Typography variant="body2" align="center" sx={{ color: "#ccc" }}>
              {currState === "Sign Up"
                ? "Already have an account? "
                : "Create an account "}
              <span
                onClick={() =>
                  setCurrState(currState === "Sign Up" ? "Login" : "Sign Up")
                }
                style={{ color: "#90caf9", cursor: "pointer" }}
              >
                {currState === "Sign Up" ? "Sign In" : "Sign Up"}
              </span>
            </Typography>

            {currState === "Login" && (
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
                Forget Password?
              </Link>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
