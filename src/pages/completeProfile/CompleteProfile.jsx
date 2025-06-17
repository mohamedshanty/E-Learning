import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar,
  InputLabel,
  FormControl,
  Paper,
  CircularProgress,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { LoadingButton } from "@mui/lab";
import assets from "../../assets/assets";
import CustomTextField from "../../components/CustomTextField/CustomTextField";

const options = [
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Redux",
  "TypeScript",
];

const CompleteProfile = () => {
  const [profileForm, setProfileForm] = useState({
    phone: "",
    image: null,
    year: "",
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/home");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
      <Container maxWidth="lg">
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
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Complete Your Profile
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 4,
                flex: 1,
              }}
            >
              <label htmlFor="avatar">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    id="avatar"
                    hidden
                  />
                  <img
                    style={{
                      maxWidth: "90px",
                      aspectRatio: "1/1",
                      borderRadius: "50%",
                    }}
                    src={
                      profileForm.image
                        ? URL.createObjectURL(profileForm.image)
                        : assets.avatar_icon
                    }
                    alt=""
                  />
                  Upload Profile Image
                </Box>
              </label>

              <CustomTextField
                label="Phone"
                name="phone"
                fullWidth
                value={profileForm.phone}
                onChange={handleChange}
              />
              <FormControl
                fullWidth
                sx={{
                  "& label": {
                    color: "#bbb",
                  },
                  "& label.Mui-focused": {
                    color: "#ccc",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "#555",
                    },
                    "&:hover fieldset": {
                      borderColor: "#888",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2c5364",
                    },
                  },
                }}
              >
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="year"
                  value={profileForm.year}
                  onChange={handleChange}
                >
                  <MenuItem value="1">First Year</MenuItem>
                  <MenuItem value="2">Second Year</MenuItem>
                  <MenuItem value="3">Third Year</MenuItem>
                  <MenuItem value="4">Fourth Year</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                options={options}
                value={selectedOptions}
                onChange={(event, newValue) => setSelectedOptions(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                      sx={{
                        backgroundColor: "transpaarent",
                        color: "#fff",
                        borderColor: "#00ADB5",
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Search Topics"
                    placeholder="Start typing..."
                  />
                )}
                sx={{ width: "100%", maxWidth: 500 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={
                  loading && (
                    <CircularProgress size={20} sx={{ color: "#ddd" }} />
                  )
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
                    Saving...
                  </Typography>
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{
                  maxWidth: "200px",
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                }}
                src={
                  profileForm.image
                    ? URL.createObjectURL(profileForm.image)
                    : assets.avatar_icon
                }
                alt=""
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompleteProfile;
