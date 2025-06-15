import React, { useContext, useState } from "react";
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
} from "@mui/material";
import Header from "../../components/header/Header";
import { CoursesContext } from "../../context/CoursesContext";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";

const filterOptions = ["all", "in-progress", "completed"];

const Courses = () => {
  const [tabValue, setTabValue] = useState("all");
  const { courses } = useContext(CoursesContext);
  const navigate = useNavigate();

  // حساب التقدم بناءً على المحاضرات في كل كورس
  const coursesWithProgress = courses.map((course) => {
    const totalLectures = course.lectures.length;
    const lecturesCompleted = course.lectures.filter(
      (lec) => lec.isCompleted
    ).length;
    const progress =
      totalLectures === 0 ? 0 : (lecturesCompleted / totalLectures) * 100;

    let status = "in-progress";
    if (progress === 100) status = "completed";
    else if (progress === 0) status = "not-started";

    return {
      ...course,
      totalLectures,
      lecturesCompleted,
      progress,
      status,
    };
  });

  // فلترة الكورسات حسب التبويب
  const filteredCourses = coursesWithProgress.filter((course) => {
    if (tabValue === "all") return true;
    return course.status === tabValue;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          background: "linear-gradient(to bottom, #0A0A0A,#101624)",
          minHeight: "100vh",
          py: 15,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ color: "#00ADB5", fontWeight: "bold", mb: 2 }}
          >
            My Courses
          </Typography>
          <Typography variant="body1" sx={{ color: "#cccccc", mb: 4 }}>
            Track your learning progress and access all your registered courses
            in one place.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            {filterOptions.map((option) => (
              <Chip
                key={option}
                label={
                  option === "all"
                    ? "All Courses"
                    : option === "in-progress"
                      ? "In Progress"
                      : "Completed"
                }
                onClick={() => setTabValue(option)}
                sx={{
                  backgroundColor: tabValue === option ? "#00ADB5" : "#1e1e1e",
                  color: tabValue === option ? "#ffffff" : "#aaaaaa",
                  "&:hover": {
                    backgroundColor: "#00ADB5",
                    color: "#ffffff",
                  },
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Stack>

          {filteredCourses.length > 0 ? (
            <Grid container spacing={4}>
              {filteredCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Card sx={{ backgroundColor: "#1e1e1e", color: "#ffffff" }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="#aaaaaa" mt={1}>
                        Lectures: {course.totalLectures}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2 }}
                        color="#aaaaaa"
                      >
                        {course.lecturesCompleted} of {course.totalLectures}{" "}
                        lectures completed
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          mt: 1,
                          backgroundColor: "#333",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #00ADB5, #00FFF0)",
                          },
                        }}
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        size="small"
                        sx={{ color: "#00ADB5" }}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <Typography variant="h6" sx={{ color: "#cccccc", mb: 2 }}>
                You haven't registered any courses yet.
              </Typography>
              <CustomButton to={"/home"}>Browse Courses</CustomButton>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Courses;
