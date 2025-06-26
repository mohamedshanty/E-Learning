import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
  Paper,
  CircularProgress,
  Autocomplete,
  Chip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import CustomTextField from "../../components/customTextField/CustomTextField";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { db } from "../../config/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00ADB5",
    },
    secondary: {
      main: "#393E46",
    },
    background: {
      default: "#0A0A0A",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#EEEEEE",
      secondary: "#AAAAAA",
    },
  },
});

const topicsByYear = {
  1: ["HTML", "CSS", "JavaScript", "Git and GitHub"],
  2: ["React", "Redux", "TypeScript"],
  3: ["Node.js", "Express", "MongoDB"],
  4: ["Advanced JS", "Testing", "Performance"],
  5: ["Project", "Deployment", "CI/CD"],
};

const CompleteProfile = () => {
  const [profileForm, setProfileForm] = useState({
    phone: "",
    image: null,
    year: "",
  });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileForm.image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profileForm.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileForm.image]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      !profileForm.phone ||
      !profileForm.year ||
      selectedOptions.length === 0
    ) {
      toast.error(
        "Please fill all required fields and select at least one topic"
      );
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      let imageUrl = "";
      if (profileForm.image) {
        if (!profileForm.image.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          setLoading(false);
          return;
        }
        imageUrl = await toast.promise(
          uploadImageToCloudinary(profileForm.image),
          {
            loading: "Uploading image...",
            success: "Image uploaded!",
            error: "Failed to upload image",
          }
        );
      }

      await setDoc(doc(db, "profiles", userId), {
        phone: profileForm.phone,
        year: profileForm.year,
        topics: selectedOptions,
        imageUrl,
        updatedAt: Date.now(),
      });

      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const allCourses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchingCourses = allCourses.filter(
        (course) =>
          course.year === profileForm.year &&
          course.topics?.some((topic) => selectedOptions.includes(topic))
      );

      const userUpdateData = {
        profileCompleted: true,
        ...(imageUrl && { avatar: imageUrl }),
      };

      if (matchingCourses.length > 0) {
        userUpdateData.enrolledCourses = matchingCourses.map(
          (course) => course.id
        );
      }

      await updateDoc(doc(db, "users", userId), userUpdateData);

      if (matchingCourses.length > 0) {
        toast.success(
          `You have been enrolled in ${matchingCourses.length} courses!`
        );
      } else {
        toast.success("Profile saved successfully! No matching courses found.");
      }

      navigate("/courses");
    } catch (err) {
      console.error("Profile Save Error:", err);
      toast.error("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (name === "year") {
      setSelectedOptions([]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              padding: 4,
              backgroundColor: "background.paper",
              borderRadius: 3,
              color: "text.primary",
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Complete Your Profile
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 4,
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
                      src={preview || assets.avatar_icon}
                      alt="avatar"
                    />
                    <Typography variant="body1">
                      Upload Profile Image
                    </Typography>
                  </Box>
                </label>

                <CustomTextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={profileForm.phone}
                  onChange={handleChange}
                  required
                />

                <FormControl fullWidth>
                  <InputLabel id="year-label">Academic Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="year"
                    value={profileForm.year}
                    onChange={handleChange}
                    required
                    label="Academic Year"
                    sx={{
                      color: "text.primary",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "secondary.main",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="1">First Year</MenuItem>
                    <MenuItem value="2">Second Year</MenuItem>
                    <MenuItem value="3">Third Year</MenuItem>
                    <MenuItem value="4">Fourth Year</MenuItem>
                    <MenuItem value="5">Fifth Year</MenuItem>
                  </Select>
                </FormControl>

                {profileForm.year && (
                  <Autocomplete
                    multiple
                    options={topicsByYear[profileForm.year] || []}
                    value={selectedOptions}
                    onChange={(event, newValue) => {
                      const limitedValues = newValue.slice(0, 3);
                      setSelectedOptions(limitedValues);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          sx={{
                            backgroundColor: "transparent",
                            color: "text.primary",
                            borderColor: "primary.main",
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Select Topics (Max 3)"
                        placeholder="Start typing..."
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || selectedOptions.length === 0}
                  startIcon={
                    loading && (
                      <CircularProgress size={20} sx={{ color: "#ddd" }} />
                    )
                  }
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    mt: 2,
                  }}
                >
                  {loading ? "Saving..." : "Save Profile"}
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
                    maxWidth: "300px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    aspectRatio: "1 / 1",
                  }}
                  src={preview || assets.profile_complete_illustration}
                  alt="Profile Completion"
                />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CompleteProfile;
