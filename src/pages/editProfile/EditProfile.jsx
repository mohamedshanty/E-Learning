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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";
import assets from "../../assets/assets";
import CustomTextField from "../../components/customTextField/CustomTextField";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

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

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    phone: "",
    year: "",
    image: null,
    imageUrl: "",
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const fetchData = async () => {
      try {
        const profileDoc = await getDoc(doc(db, "profiles", uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfileData((prev) => ({
            ...prev,
            phone: data.phone || "",
            year: data.year || "",
            imageUrl: data.imageUrl || "",
          }));
          setSelectedTopics(data.topics || []);
          setPreview(data.imageUrl || "");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (profileData.image) {
      const objectUrl = URL.createObjectURL(profileData.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileData.image]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : files ? files[0] : value,
    }));

    if (name === "year") setSelectedTopics([]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const uid = localStorage.getItem("uid");

    if (!uid || !profileData.year || selectedTopics.length === 0) {
      toast.error("Please fill all fields and select at least one topic");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = profileData.imageUrl;

      if (profileData.image && profileData.image.type?.startsWith("image/")) {
        imageUrl = await toast.promise(
          uploadImageToCloudinary(profileData.image),
          {
            loading: "Uploading image...",
            success: "Image uploaded",
            error: "Image upload failed",
          }
        );
      }

      await updateDoc(doc(db, "profiles", uid), {
        phone: profileData.phone,
        year: profileData.year,
        topics: selectedTopics,
        imageUrl,
        updatedAt: Date.now(),
      });

      if (imageUrl) {
        await updateDoc(doc(db, "users", uid), {
          avatar: imageUrl,
        });
      }

      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const allCourses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchedCourses = allCourses.filter(
        (course) =>
          Number(course.year) === Number(profileData.year) &&
          course.topics?.some((topic) => selectedTopics.includes(topic))
      );

      console.log(
        `Found ${matchedCourses.length} courses matching new criteria`
      );
      console.log("Year:", profileData.year);
      console.log("Topics:", selectedTopics);
      console.log(
        "Matched courses:",
        matchedCourses.map((c) => ({ id: c.id, title: c.title }))
      );

      await updateDoc(doc(db, "users", uid), {
        enrolledCourses: matchedCourses.map((course) => course.id),
      });

      toast.success(
        `Profile updated successfully! Enrolled in ${matchedCourses.length} courses`
      );
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
        }}
      >
        <Typography color="#fff">Loading profile...</Typography>
      </Box>
    );
  }

  return (
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
            backgroundColor: "#1e1e1e",
            borderRadius: 3,
            color: "#eee",
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Edit Your Profile
          </Typography>

          <Box
            component="form"
            onSubmit={handleSave}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
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
                  src={preview || assets.avatar_icon}
                  alt="avatar"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <Typography>Upload Profile Image</Typography>
              </Box>
            </label>

            <CustomTextField
              label="Phone"
              name="phone"
              fullWidth
              value={profileData.phone}
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
                value={profileData.year}
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
                <MenuItem value="1" sx={{ color: "#000" }}>
                  First Year
                </MenuItem>
                <MenuItem value="2" sx={{ color: "#000" }}>
                  Second Year
                </MenuItem>
                <MenuItem value="3" sx={{ color: "#000" }}>
                  Third Year
                </MenuItem>
                <MenuItem value="4" sx={{ color: "#000" }}>
                  Fourth Year
                </MenuItem>
              </Select>
            </FormControl>

            {profileData.year && (
              <Autocomplete
                multiple
                options={topicsByYear[profileData.year] || []}
                value={selectedTopics}
                onChange={(event, newValue) => setSelectedTopics(newValue)}
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
                  />
                )}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} sx={{ color: "#fff" }} />
              }
              sx={{
                backgroundColor: "#00ADB5",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#007f89",
                },
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfile;
