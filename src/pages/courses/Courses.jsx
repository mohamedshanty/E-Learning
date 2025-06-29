import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  CardActions,
  Stack,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  TextField,
} from "@mui/material";
import Header from "../../components/header/Header";
import { CoursesContext } from "../../context/CoursesContext";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import CustomTextField from "../../components/customTextField/CustomTextField";

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

const filterOptions = ["all", "in-progress", "completed", "not-started"];

const Courses = () => {
  const [tabValue, setTabValue] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { courses, loading, error, refreshCourses } =
    useContext(CoursesContext);
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("uid");
      if (userId) {
        const [userDoc, profileDoc] = await Promise.all([
          getDoc(doc(db, "users", userId)),
          getDoc(doc(db, "profiles", userId)),
        ]);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesTab = tabValue === "all" || course.status === tabValue;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (userData?.enrolledCourses?.length > 0) {
        return (
          matchesTab &&
          matchesSearch &&
          userData.enrolledCourses.includes(course.id)
        );
      }

      if (!userProfile) return false;

      const yearMatches = course.year === userProfile.year;
      const topicsMatch = userProfile.topics?.some((topic) =>
        course.topics?.includes(topic)
      );

      return matchesTab && matchesSearch && yearMatches && topicsMatch;
    });
  }, [courses, tabValue, searchQuery, userData, userProfile]);

  const handleRefresh = async () => {
    try {
      await refreshCourses();
    } catch (err) {
      console.error("Error refreshing courses:", err);
    }
  };

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            background: "linear-gradient(to bottom, #0A0A0A, #101624)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 3,
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Failed to load courses
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {error.message || "Please check your connection and try again"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box
        sx={{
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          minHeight: "100vh",
          py: { xs: 8, md: 15 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                {userData?.enrolledCourses?.length > 0
                  ? "My Courses"
                  : "Available Courses"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {userData?.enrolledCourses?.length > 0
                  ? "Your enrolled courses"
                  : "Courses matching your academic year and selected topics"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                mt: { xs: 2, sm: 0 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <CustomTextField
                fullWidth={isMobile}
                size="small"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <TextField
                fullWidth={isMobile}
                size="small"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mr: 2,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "text.primary",
                    "& fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              /> */}

              <Tooltip title="Refresh courses">
                <IconButton
                  onClick={handleRefresh}
                  color="primary"
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mb: 4,
              flexWrap: "wrap",
              "& > *": { mb: 1 },
            }}
          >
            {filterOptions.map((option) => (
              <Chip
                key={option}
                label={
                  option === "all"
                    ? "All"
                    : option === "in-progress"
                      ? "In Progress"
                      : option === "completed"
                        ? "Completed"
                        : "Not Started"
                }
                onClick={() => setTabValue(option)}
                sx={{
                  backgroundColor:
                    tabValue === option ? "primary.main" : "secondary.main",
                  color: tabValue === option ? "#fff" : "text.primary",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "#fff",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>

          {loading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "secondary.main",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : filteredCourses.length > 0 ? (
            <Grid container spacing={4}>
              {filteredCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Card
                    sx={{
                      backgroundColor: "background.paper",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.title}
                      </Typography>
                      {course.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {course.description}
                        </Typography>
                      )}
                      {course.topics && course.topics.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Topics:
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {course.topics.slice(0, 3).map((topic) => (
                              <Chip
                                key={topic}
                                label={topic}
                                size="small"
                                sx={{
                                  backgroundColor: "secondary.main",
                                  color: "text.primary",
                                }}
                              />
                            ))}
                            {course.topics.length > 3 && (
                              <Chip
                                label={`+${course.topics.length - 3}`}
                                size="small"
                                sx={{
                                  backgroundColor: "secondary.main",
                                  color: "text.primary",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {course.lectures?.filter((l) => l.isCompleted)
                            .length || 0}
                          /{course.lectures?.length || 0} lectures
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          {course.progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress || 0}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "secondary.main",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #00ADB5, #00FFF0)",
                          },
                        }}
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button
                        onClick={() => {
                          navigate(`/courses/${course.id}`);
                        }}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {course.status === "not-started" ? "Start" : "Continue"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                mt: 10,
                p: 4,
                backgroundColor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                {searchQuery
                  ? "No courses match your search"
                  : userData?.enrolledCourses?.length > 0
                    ? "No enrolled courses match your filters"
                    : "No available courses match your profile"}
              </Typography>
              <CustomButton to="/home" variant="contained">
                {userData?.enrolledCourses?.length > 0
                  ? "Browse Available Courses"
                  : "Complete Your Profile"}
              </CustomButton>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Courses;
