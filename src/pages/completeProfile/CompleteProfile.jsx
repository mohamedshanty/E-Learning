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
  getDoc,
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
  1: [
    "Introduction to Computing",
    "Calculus I",
    "Principles of Management",
    "Electrical Circuits",
    "Electronics",
    "Computer Programming II (Java)",
    "Calculus II",
    "Technical Writing Skills",
    "Introduction to Engineering",
  ],

  2: [
    "Introduction to Software Engineering",
    "Data Structures",
    "Discrete Mathematics",
    "Global Network Technology",
    "Computer Programming II",
    "Digital Logic Design",
    "Computer Organization and Assembly Language",
    "Software Requirements Engineering",
    "Advanced Programming (Python)",
    "Algorithms",
    "Principles of Statistics",
    "Linear Algebra",
    "Systems Analysis",
  ],

  3: [
    "Operating Systems",
    "Automata Theory",
    "Computer Networks",
    "Web Application Development",
    "Web Page Design",
    "Computer Graphics",
    "Database Systems",
    "Linear Algebra",
  ],

  4: [
    "Information Security",
    "Artificial Intelligence",
    "Software Project Management",
    "Advanced Software Design",
    "Human-Computer Interaction",
  ],
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  // جلب بيانات المستخدم الحالية عند تحميل الصفحة
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("uid");
        if (!userId) {
          toast.error("User ID not found. Please log in again.");
          setIsLoadingData(false);
          return;
        }

        const profileDoc = await getDoc(doc(db, "profiles", userId));

        if (profileDoc.exists()) {
          const userData = profileDoc.data();

          // تعبئة البيانات الحالية
          setProfileForm({
            phone: userData.phone || "",
            image: null,
            year: userData.year || "",
          });

          setSelectedOptions(userData.topics || []);
          setPreview(userData.imageUrl || assets.avatar_icon);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!profileForm.image) {
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
      } else if (preview && preview !== assets.avatar_icon) {
        // إذا كانت هناك صورة موجودة مسبقاً ولم يتم تغييرها
        imageUrl = preview;
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
          `Profile updated! Enrolled in ${matchingCourses.length} courses!`
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

  if (isLoadingData) {
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
          <CircularProgress sx={{ color: "#00ADB5" }} />
        </Box>
      </ThemeProvider>
    );
  }

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
              {preview === assets.avatar_icon
                ? "Complete Your Profile"
                : "Update Your Profile"}
            </Typography>

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 4,
              }}
            >
              <label htmlFor="avatar">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                  }}
                >
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
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    src={preview || assets.avatar_icon}
                    alt="avatar"
                    onClick={() => document.getElementById("avatar").click()}
                  />
                  <Typography variant="body1">
                    {preview === assets.avatar_icon
                      ? "Upload Profile Image"
                      : "Change Profile Image"}
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

              <FormControl fullWidth margin="normal" sx={{ color: "#EEEEEE" }}>
                <InputLabel id="year-label" sx={{ color: "#AAAAAA" }}>
                  Academic Year *
                </InputLabel>
                <Select
                  labelId="year-label"
                  name="year"
                  value={profileForm.year}
                  onChange={handleChange}
                  required
                  label="Academic Year *"
                  sx={{
                    color: "#EEEEEE",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#333",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#00ADB5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#00ADB5",
                    },
                  }}
                >
                  <MenuItem value="1">First Year</MenuItem>
                  <MenuItem value="2">Second Year</MenuItem>
                  <MenuItem value="3">Third Year</MenuItem>
                  <MenuItem value="4">Fourth Year</MenuItem>
                </Select>
              </FormControl>

              {profileForm.year && (
                <Autocomplete
                  multiple
                  options={topicsByYear[profileForm.year] || []}
                  value={selectedOptions}
                  onChange={(event, newValue) => {
                    setSelectedOptions(newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        sx={{
                          backgroundColor: "#393E46",
                          color: "#EEEEEE",
                          "& .MuiChip-deleteIcon": {
                            color: "#AAAAAA",
                            "&:hover": {
                              color: "#EEEEEE",
                            },
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Select Topics"
                      placeholder="Start typing..."
                      margin="normal"
                      fullWidth
                    />
                  )}
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-listbox": {
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      "& .MuiAutocomplete-option": {
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "#e0e0e0",
                        },
                      },
                    },
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{ backgroundColor: "#ffffff", color: "#444444" }}
                    >
                      {option}
                    </li>
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "200px",
                      backgroundColor: "#ffffff",
                    },
                  }}
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
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CompleteProfile;
