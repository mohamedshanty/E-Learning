import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import { CoursesContext } from "../../context/CoursesContext";
import Header from "../../components/header/Header";
import { WatchLaterContext } from "../../context/WatchLaterContext";
import CustomButton from "../../components/CustomButton/CustomButton";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const CourseDetails = () => {
  const { id } = useParams();
  const { courses, markLectureComplete, markLectureUnwatched } =
    useContext(CoursesContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLecture, setMenuLecture] = useState(null);

  const { addToWatchLater } = useContext(WatchLaterContext);

  const course = courses.find((c) => c.id === parseInt(id));
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  // const [watchedLectures, setWatchedLectures] = useState([]);
  // const [selectedLecture, setSelectedLecture] = useState(course?.lectures[0]);

  if (!course) return <Typography color="error">Course not found</Typography>;

  const currentLecture = course.lectures[currentLectureIndex];

  const handleMenuOpen = (event, lecture) => {
    setAnchorEl(event.currentTarget);
    setMenuLecture(lecture);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLecture(null);
  };

  const watchedLectures = course.lectures.filter((lec) => lec.isCompleted);
  const progress = (watchedLectures.length / course.lectures.length) * 100;

  const handleMarkAsWatched = () => {
    const currentLecture = course.lectures[currentLectureIndex];

    if (!currentLecture.isCompleted) {
      markLectureComplete(currentLecture.id, course.id);
      toast.success("Lecture marked as watched", {
        style: {
          background: "#1e1e1e",
          color: "#fff",
          border: "1px solid #00ADB5",
        },
        iconTheme: {
          primary: "#00ADB5",
          secondary: "#fff",
        },
      });
    }
  };

  // const progress = (watchedLectures.length / course.lectures.length) * 100;

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          py: 15,
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ color: "#00ADB5", fontWeight: "bold", mb: 2 }}
          >
            {course.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc", mb: 4 }}>
            {course.lectures.length} Lectures - Progress: {Math.round(progress)}
            %
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <ReactPlayer
                url={currentLecture.videoUrl}
                controls
                width="100%"
                // height="400px"
              />
              <Typography variant="h6" sx={{ color: "#fff", mt: 2 }}>
                {currentLecture.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
                {currentLecture.description}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <CustomButton
                  onClick={() => {
                    markLectureUnwatched(course.id, currentLecture.id);
                    toast.success("Lecture marked as unwatched");
                  }}
                >
                  Mark as Unwatched
                </CustomButton>
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                maxHeight: "80vh",
                overflowY: "auto",
                mt: { xs: 0, md: -6 },
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                Lectures
              </Typography>
              <List sx={{ backgroundColor: "#1e1e1e", borderRadius: 2, p: 0 }}>
                {course.lectures.map((lecture, index) => (
                  <React.Fragment key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pr: 1,
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: "#00ADB5",
                          borderRadius: 2,
                          "& .more-icon": {
                            color: "#fff",
                          },
                        },
                      }}
                    >
                      <ListItem
                        button="true"
                        selected={index === currentLectureIndex}
                        onClick={() => setCurrentLectureIndex(index)}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#00ADB5",
                            color: "#fff",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            lecture.isCompleted
                              ? `✅ ${lecture.title}`
                              : lecture.title
                          }
                          secondary={lecture.duration}
                          sx={{
                            color: "#fff",
                            ".MuiListItemText-secondary": {
                              color: "#777",
                            },
                          }}
                        />
                      </ListItem>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, lecture)}
                        sx={{ color: "#00ADB5", ml: 1 }}
                        className="more-icon" // أضف هذا الكلاس هنا
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {index < course.lectures.length - 1 && (
                      <Divider sx={{ borderColor: "#3b3b3b" }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    markLectureComplete(menuLecture.id, course.id);
                    toast.success("Lecture marked as watched");
                    handleMenuClose();
                  }}
                >
                  Mark as Watched
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    addToWatchLater({
                      id: menuLecture.id,
                      title: menuLecture.title,
                      description: menuLecture.description,
                      videoUrl: menuLecture.videoUrl,
                      courseId: course.id,
                      courseTitle: course.title,
                    });
                    toast.success("Added to Watch Later");
                    handleMenuClose();
                  }}
                >
                  Add to Watch Later
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    markLectureUnwatched(course.id, menuLecture.id);
                    toast.success("Lecture marked as unwatched");
                    handleMenuClose();
                  }}
                >
                  Mark as Unwatched
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CourseDetails;
