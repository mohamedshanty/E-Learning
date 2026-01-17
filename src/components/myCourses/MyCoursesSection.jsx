import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Skeleton,
  CardActions,
  CircularProgress,
  ThemeProvider,
  createTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../CustomButton/CustomButton";
import CustomTextField from "../customTextField/CustomTextField";
import { CoursesContext } from "../../context/CoursesContext";
import Autocomplete from "@mui/material/Autocomplete";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../EmptyState/EmptyState";

// Framer Motion components
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionButton = motion(Button);
const MotionIconButton = motion(IconButton);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

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

const MyCoursesSection = () => {
  const { courses, loading, error, refreshCourses } =
    useContext(CoursesContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    topics: [],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("uid");
      if (userId) {
        const [profileDoc, userDoc] = await Promise.all([
          getDoc(doc(db, "profiles", userId)),
          getDoc(doc(db, "users", userId)),
        ]);

        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleOpen = () => {
    if (!userProfile?.year) {
      toast.error("Please complete your profile first");
      navigate("/profile");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCourseData({ topics: [] });
  };

  const handleAddCourse = useCallback(async () => {
    if (courseData.topics.length === 0 || !userProfile?.year) return;

    setIsAdding(true);
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        setIsAdding(false);
        return;
      }

      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const allCourses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchingCourses = allCourses.filter((course) =>
        course.topics?.some((topic) =>
          courseData.topics.some(
            (selectedTopic) =>
              topic.toLowerCase() === selectedTopic.toLowerCase()
          )
        )
      );

      if (matchingCourses.length === 0) {
        toast.error("No courses found matching your selected topics");
        setIsAdding(false);
        return;
      }

      const userRef = doc(db, "users", userId);
      const currentEnrolled = userData?.enrolledCourses || [];
      const newEnrolled = [
        ...new Set([...currentEnrolled, ...matchingCourses.map((c) => c.id)]),
      ];

      await updateDoc(userRef, {
        enrolledCourses: newEnrolled,
      });

      const profileRef = doc(db, "profiles", userId);
      const currentTopics = userProfile?.topics || [];
      const newTopics = [...new Set([...currentTopics, ...courseData.topics])];

      await updateDoc(profileRef, {
        topics: newTopics,
      });

      setUserProfile((prev) => ({ ...prev, topics: newTopics }));
      setUserData((prev) => ({ ...prev, enrolledCourses: newEnrolled }));

      toast.success(`${matchingCourses.length} courses added successfully!`);
      await refreshCourses();
      handleClose();
    } catch (error) {
      console.error("Error adding courses:", error);
      toast.error("Failed to add courses");
    } finally {
      setIsAdding(false);
    }
  }, [courseData, userData, userProfile, refreshCourses]);

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshCourses();
    } catch (err) {
      console.error("Error refreshing courses:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCourses]);

  const filteredCourses = useMemo(() => {
    if (!userData?.enrolledCourses?.length) return [];

    console.log("User enrolledCourses:", userData?.enrolledCourses);
    console.log("User topics:", userProfile?.topics);
    console.log("All courses:", courses);

    const filtered = courses.filter((course) =>
      userData.enrolledCourses.includes(course.id)
    );

    console.log("filteredCourses length:", filtered.length);

    return filtered;
  }, [courses, userData, userProfile]);

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            background: "linear-gradient(to bottom, #0A0A0A, #101624)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            py: 10,
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <MotionTypography
            variant="h5"
            color="error"
            gutterBottom
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            Failed to load courses
          </MotionTypography>
          <MotionTypography
            color="text.secondary"
            sx={{ mb: 3 }}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {error.message || "Please check your connection and try again"}
          </MotionTypography>
          <MotionButton
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            disabled={isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRefreshing ? "Refreshing..." : "Retry"}
          </MotionButton>
        </MotionBox>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          py: 10,
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
            }}
          >
            <MotionTypography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              My Courses
            </MotionTypography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Refresh courses">
                <MotionIconButton
                  onClick={handleRefresh}
                  color="primary"
                  disabled={isRefreshing}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshIcon />
                </MotionIconButton>
              </Tooltip>
              <CustomButton
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                Add Course
              </CustomButton>
            </Box>
          </MotionBox>

          {isRefreshing && (
            <MotionBox
              sx={{ display: "flex", justifyContent: "center", my: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CircularProgress color="primary" />
            </MotionBox>
          )}

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
              <AnimatePresence>
                {filteredCourses.slice(0, 6).map((course) => (
                  <MotionGrid
                    size={{ xs: 12, sm: 6, md: 4 }}
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MotionCard
                      sx={{
                        backgroundColor: "background.paper",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                      }}
                      transition={{ duration: 0.3 }}
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
                              {course.topics.map((topic) => (
                                <motion.div
                                  key={topic}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Chip
                                    label={topic}
                                    size="small"
                                    sx={{
                                      backgroundColor: "secondary.main",
                                      color: "text.primary",
                                    }}
                                  />
                                </motion.div>
                              ))}
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
                        <MotionButton
                          onClick={() => {
                            navigate(`/courses/${course.id}`);
                          }}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Start
                        </MotionButton>
                      </CardActions>
                    </MotionCard>
                  </MotionGrid>
                ))}
              </AnimatePresence>
            </Grid>
          ) : (
            <EmptyState
              type="profile"
              title={
                userProfile?.topics?.length > 0
                  ? "No courses available for your selected topics yet"
                  : "You haven't selected any topics in your profile"
              }
              description={
                userProfile?.topics?.length > 0
                  ? "Courses will appear here once they are added."
                  : "Complete your profile to start getting courses."
              }
              actionLabel={
                userProfile?.topics?.length > 0
                  ? "Browse All Courses"
                  : "Complete Your Profile"
              }
              actionTo={
                userProfile?.topics?.length > 0 ? "/courses" : "/profile"
              }
            />
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 5,
            }}
          >
            <CustomButton to={"/courses"}>View All Courses</CustomButton>
          </Box>

          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 20 },
              sx: {
                backgroundColor: "background.paper",
                color: "text.primary",
                borderRadius: 2,
              },
            }}
          >
            <DialogTitle
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Add New Course
            </DialogTitle>

            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Academic Year: <strong>Year {userProfile?.year}</strong>
              </Typography>

              <Autocomplete
                multiple
                options={
                  userProfile?.year ? topicsByYear[userProfile.year] || [] : []
                }
                value={courseData.topics}
                onChange={(event, newValue) => {
                  setCourseData({ ...courseData, topics: newValue });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <motion.div
                      key={option}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
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
                    </motion.div>
                  ))
                }
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Select Topics"
                    placeholder="Start typing..."
                  />
                )}
                sx={{ mt: 1 }}
              />
            </DialogContent>

            <DialogActions
              sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
            >
              <MotionButton
                onClick={handleClose}
                color="error"
                variant="outlined"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </MotionButton>
              <MotionButton
                onClick={handleAddCourse}
                disabled={courseData.topics.length === 0 || isAdding}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAdding ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Adding...
                  </>
                ) : (
                  "Add Courses"
                )}
              </MotionButton>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MyCoursesSection;
