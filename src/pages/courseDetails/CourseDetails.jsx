import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  LinearProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/header/Header";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
import {
  MoreVert,
  CheckCircle,
  WatchLater,
  ArrowBack,
} from "@mui/icons-material";
import { CoursesContext } from "../../context/CoursesContext";
import { WatchLaterContext } from "../../context/WatchLaterContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const { courses, loading, markLectureComplete, markLectureUnwatched } =
    useContext(CoursesContext);
  const { addToWatchLater } = useContext(WatchLaterContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuLecture, setMenuLecture] = useState(null);

  const currentLectureRef = useRef(currentLectureIndex);
  currentLectureRef.current = currentLectureIndex;

  const course = courses?.find((c) => c.id === id);

  useEffect(() => {
    if (
      course?.lectures?.length > 0 &&
      currentLectureIndex >= course.lectures.length
    ) {
      setCurrentLectureIndex(0);
    }
  }, [course, currentLectureIndex]);

  if (loading) {
    return (
      <Box
        sx={{
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          minHeight: "100vh",
          pt: 15,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="rectangular"
            width={300}
            height={40}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={200}
            height={20}
            sx={{ mb: 4 }}
          />
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="rectangular" height={isMobile ? 200 : 450} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton
                variant="rectangular"
                width={120}
                height={40}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                  {i < 4 && <Divider sx={{ borderColor: "#333", my: 1 }} />}
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box
        sx={{
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" color="error" gutterBottom>
            Course Not Found
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>
            The course you're looking for doesn't exist or may have been
            removed.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/courses")}
            startIcon={<ArrowBack />}
          >
            Back to Courses
          </Button>
        </Container>
      </Box>
    );
  }

  const currentLecture = course.lectures?.[currentLectureIndex];
  const watchedLecturesCount =
    course.lectures?.filter((lec) => lec.isCompleted).length || 0;
  const totalLectures = course.lectures?.length || 0;
  const progress =
    totalLectures > 0
      ? Math.round((watchedLecturesCount / totalLectures) * 100)
      : 0;

  const handleMenuOpen = (event, lecture) => {
    setAnchorEl(event.currentTarget);
    setMenuLecture(lecture);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLecture(null);
  };

  const handleProgress = () => {};

  if (!currentLecture) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography variant="h5" color="error">
          No lectures found in this course
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 10, md: 15 },
          px: { xs: 0, sm: 2 },
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/courses")}
              sx={{
                color: "#00ADB5",
                mb: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 173, 181, 0.1)",
                },
              }}
            >
              Back to Courses
            </Button>

            <Typography
              variant="h4"
              sx={{
                color: "#00ADB5",
                fontWeight: "bold",
                mb: 1,
                fontSize: { xs: "1.8rem", sm: "2.2rem" },
              }}
            >
              {course.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={`${totalLectures} Lectures`}
                size="small"
                sx={{ backgroundColor: "#393E46", color: "#EEEEEE" }}
              />
              <Chip
                label={`${progress}% Completed`}
                size="small"
                sx={{
                  backgroundColor: progress === 100 ? "#4CAF50" : "#00ADB5",
                  color: "#fff",
                }}
              />
              {course.category && (
                <Chip
                  label={course.category}
                  size="small"
                  sx={{ backgroundColor: "#222831", color: "#EEEEEE" }}
                />
              )}
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                  mb: 2,
                }}
              >
                <ReactPlayer
                  url={currentLecture.videoUrl}
                  controls
                  width="100%"
                  height={isMobile ? "auto" : "450px"}
                  playing={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onProgress={handleProgress}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                      },
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                }}
              >
                <Typography variant="h5" sx={{ color: "#fff", mb: 1 }}>
                  {currentLecture.title}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    mb: 2,
                    backgroundColor: "#333",
                    "& .MuiLinearProgress-bar": {
                      background:
                        progress === 100
                          ? "#4CAF50"
                          : "linear-gradient(90deg, #00ADB5, #00FFF0)",
                    },
                  }}
                />

                <Typography variant="body2" sx={{ color: "#aaa", mb: 3 }}>
                  {currentLecture.description || "No description available"}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Tooltip
                    title={
                      currentLecture.isCompleted
                        ? "Mark as unwatched"
                        : "Mark as completed"
                    }
                  >
                    <Button
                      variant="outlined"
                      color={currentLecture.isCompleted ? "success" : "primary"}
                      startIcon={<CheckCircle />}
                      onClick={async (e) => {
                        e.preventDefault();
                        const currentIndex = currentLectureRef.current;

                        try {
                          if (currentLecture.isCompleted) {
                            await markLectureUnwatched(
                              course.id,
                              currentLecture.id,
                              () => setCurrentLectureIndex(currentIndex)
                            );
                            toast.success("Lecture marked as unwatched");
                          } else {
                            await markLectureComplete(
                              course.id,
                              currentLecture.id,
                              () => setCurrentLectureIndex(currentIndex)
                            );
                            toast.success("Lecture marked as completed");
                          }
                        } catch (error) {
                          toast.error("Failed to update lecture status");
                          console.error(error);
                        }
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      {currentLecture.isCompleted
                        ? "Completed"
                        : "Mark Complete"}
                    </Button>
                  </Tooltip>

                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<WatchLater />}
                    onClick={(e) => {
                      e.preventDefault();
                      addToWatchLater({
                        id: currentLecture.id,
                        courseId: course.id,
                        title: currentLecture.title,
                        description: currentLecture.description,
                        videoUrl: currentLecture.videoUrl,
                        courseTitle: course.title,
                      });
                      toast.success("Added to Watch Later");
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Watch Later
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 2,
                  overflow: "hidden",
                  maxHeight: isMobile ? "none" : "80vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#00ADB5",
                    borderRadius: "3px",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#222831",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    Course Lectures
                  </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                  {course.lectures?.map((lecture, index) => (
                    <React.Fragment key={lecture.id}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          pr: 1,
                          transition: "all 0.3s",
                          backgroundColor:
                            index === currentLectureIndex
                              ? "#00ADB5"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              index === currentLectureIndex
                                ? "#00ADB5"
                                : "rgba(0, 173, 181, 0.2)",
                          },
                        }}
                      >
                        <ListItem
                          button
                          onClick={() => {
                            setCurrentLectureIndex(index);
                            setIsPlaying(true);
                          }}
                          sx={{
                            py: 1.5,
                            "&.Mui-selected": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{
                                  color:
                                    index === currentLectureIndex
                                      ? "#fff"
                                      : lecture.isCompleted
                                        ? "#4CAF50"
                                        : "#EEEEEE",
                                  fontWeight:
                                    index === currentLectureIndex
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {lecture.title}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    index === currentLectureIndex
                                      ? "rgba(255,255,255,0.7)"
                                      : "#777",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {lecture.duration}
                                {lecture.isCompleted && (
                                  <CheckCircle
                                    sx={{
                                      fontSize: "1rem",
                                      ml: 1,
                                      verticalAlign: "middle",
                                      color: "#4CAF50",
                                    }}
                                  />
                                )}
                              </Typography>
                            }
                            sx={{
                              m: 0,
                              "& .MuiListItemText-secondary": {
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                          />
                        </ListItem>

                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            handleMenuOpen(e, lecture);
                          }}
                          sx={{
                            color:
                              index === currentLectureIndex
                                ? "#fff"
                                : "#00ADB5",
                            "&:hover": {
                              color: "#fff",
                              backgroundColor: "rgba(255,255,255,0.1)",
                            },
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      {index < course.lectures.length - 1 && (
                        <Divider sx={{ borderColor: "#333" }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#1e1e1e",
                color: "#fff",
                borderRadius: 2,
                boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
                minWidth: 200,
              },
              "& .MuiMenuItem-root": {
                "&:hover": {
                  backgroundColor: "rgba(0, 173, 181, 0.2)",
                },
              },
            }}
          >
            <MenuItem
              onClick={async (e) => {
                e.preventDefault();
                const currentIndex = currentLectureRef.current;
                try {
                  if (menuLecture?.isCompleted) {
                    await markLectureUnwatched(course.id, menuLecture.id, () =>
                      setCurrentLectureIndex(currentIndex)
                    );
                    toast.success("Lecture marked as unwatched");
                  } else {
                    await markLectureComplete(course.id, menuLecture.id, () =>
                      setCurrentLectureIndex(currentIndex)
                    );
                    toast.success("Lecture marked as completed");
                  }
                } catch (error) {
                  toast.error("Failed to update lecture status");
                  console.error(error);
                }
                handleMenuClose();
              }}
              sx={{ color: menuLecture?.isCompleted ? "#4CAF50" : "#00ADB5" }}
            >
              <CheckCircle sx={{ mr: 1, fontSize: "1.2rem" }} />
              {menuLecture?.isCompleted ? "Completed" : "Mark Complete"}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                addToWatchLater({
                  id: menuLecture.id,
                  courseId: course.id,
                  title: menuLecture.title,
                  description: menuLecture.description,
                  videoUrl: menuLecture.videoUrl,
                  courseTitle: course.title,
                });
                toast.success("Added to Watch Later");
                handleMenuClose();
              }}
              sx={{ color: "#00ADB5" }}
            >
              <WatchLater sx={{ mr: 1, fontSize: "1.2rem" }} />
              Watch Later
            </MenuItem>
          </Menu>
        </Container>
      </Box>
    </>
  );
};

export default CourseDetails;
