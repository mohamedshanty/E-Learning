import React, { useContext, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../CustomButton/CustomButton";
import CustomTextField from "../CustomTextField/CustomTextField";
import { CoursesContext } from "../../context/CoursesContext";
import Autocomplete from "@mui/material/Autocomplete";

const options = [
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Redux",
  "TypeScript",
];

const MyCoursesSection = () => {
  const { courses, addCourse } = useContext(CoursesContext);

  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedOptions([]);
  };

  const handleAddCourse = () => {
    if (selectedOptions.length === 0) return;

    const newId = courses.length > 0 ? courses[courses.length - 1].id + 1 : 1;

    const totalLectures = selectedOptions.length * 5;

    const newCourse = {
      id: newId,
      title: selectedOptions.join(", "),
      lectures: Array.from({ length: totalLectures }, (_, i) => ({
        id: i + 1,
        title: `Lecture ${i + 1}`,
        isCompleted: false,
      })),
    };

    // فقط طباعة المعلومات في الكونسل بدون إضافة
    console.log("New Course Data:", newCourse);

    // ثم اغلق الديالوج
    handleClose();
  };

  const calculateProgress = (course) => {
    if (!course.lectures || course.lectures.length === 0) return 0;

    const completed = course.lectures.filter((lec) => lec.isCompleted).length;
    return Math.round((completed / course.lectures.length) * 100);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        py: 10,
        mt: -2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#00ADB5",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            My Courses
          </Typography>

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

        <Grid container spacing={4}>
          {courses.map((course) => {
            const progress = calculateProgress(course);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                <Card
                  sx={{
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="#aaaaaa">
                      Lectures: {course.lectures.length}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="#aaaaaa">
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
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
                      <Typography
                        variant="body2"
                        color="#00ADB5"
                        sx={{ mt: 0.5, fontWeight: "bold" }}
                      >
                        {progress}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

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
            sx: {
              backgroundColor: "#1e1e1e",
              color: "#ffffff",
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "#00ADB5",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Add New Course
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ color: "#ffffff", mb: 1 }}>
              Select Topics
            </Typography>

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
                      backgroundColor: "transparent",
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
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <CustomButton onClick={handleAddCourse}>Add</CustomButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyCoursesSection;
