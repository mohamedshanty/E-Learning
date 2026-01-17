import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Autocomplete,
  Chip,
  Card,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CardMedia,
} from "@mui/material";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { db } from "../../config/firebase";
import {
  doc,
  setDoc,
  collection,
  writeBatch,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { nanoid } from "nanoid";
import { CloudUpload, Edit, Delete } from "@mui/icons-material";
import CustomTextField from "../customTextField/CustomTextField";

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

const AdminCourses = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    topics: [],
    thumbnail: null,
    thumbnailUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (err) {
        console.error("Error fetching courses: ", err);
        setMessage({ text: "Failed to load courses", type: "error" });
      }
    };
    fetchCourses();
  }, []);

  const extractPlaylistId = (url) => {
    const regex = /[&?]list=([^&]+)/;
    const match = url.match(regex);
    if (!match) throw new Error("Invalid YouTube playlist URL");
    return match[1];
  };

  const convertISOToDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const fetchYouTubePlaylist = async (playlistId) => {
    const allVideos = [];
    let nextPageToken = "";
    let position = 0;

    do {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: "snippet",
            maxResults: 50,
            playlistId,
            key: import.meta.env.VITE_YOUTUBE_API_KEY,
            pageToken: nextPageToken,
          },
        }
      );

      const items = await Promise.all(
        response.data.items.map(async (item) => {
          const videoId = item.snippet.resourceId?.videoId;
          if (!videoId) return null;

          const videoResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: "contentDetails",
                id: videoId,
                key: import.meta.env.VITE_YOUTUBE_API_KEY,
              },
            }
          );

          const videoData = videoResponse.data.items[0];
          if (!videoData) return null;

          position++;

          return {
            id: videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            duration: convertISOToDuration(videoData.contentDetails.duration),
            thumbnail: item.snippet.thumbnails?.default?.url,
            isCompleted: false,
            originalPosition: position,
          };
        })
      );

      allVideos.push(...items.filter(Boolean));
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allVideos;
  };

  const handleEdit = (course) => {
    setCourseData({
      title: course.title,
      description: course.description,
      category: course.category,
      year: course.year,
      topics: course.topics || [],
      thumbnail: null,
      thumbnailUrl: course.thumbnail,
      id: course.id,
    });
    setEditMode(true);
  };

  const resetForm = () => {
    setPlaylistUrl("");
    setCourseData({
      title: "",
      description: "",
      category: "",
      year: "",
      topics: [],
      thumbnail: null,
      thumbnailUrl: "",
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (
        (!editMode && !playlistUrl) ||
        !courseData.title ||
        !courseData.year
      ) {
        throw new Error(
          editMode
            ? "Course title and year are required"
            : "Playlist URL, course title and year are required"
        );
      }

      let thumbnailUrl = courseData.thumbnailUrl;
      if (courseData.thumbnail) {
        thumbnailUrl = await uploadImageToCloudinary(courseData.thumbnail);
      }

      if (editMode) {
        // Update existing course
        const updatedCourse = {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          year: courseData.year,
          topics: courseData.topics,
          thumbnail: thumbnailUrl,
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(db, "courses", courseData.id), updatedCourse);
        setMessage({ text: "Course updated successfully", type: "success" });
      } else {
        // Create new course
        const playlistId = extractPlaylistId(playlistUrl);
        const videos = await fetchYouTubePlaylist(playlistId);
        const courseId = nanoid();

        const newCourse = {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          year: courseData.year,
          topics: courseData.topics,
          thumbnail: thumbnailUrl,
          createdAt: new Date().toISOString(),
          totalLectures: videos.length,
          progress: 0,
          status: "not-started",
          id: courseId,
          lecturesOrder: videos.map((v) => v.id),
        };

        await setDoc(doc(db, "courses", courseId), newCourse);

        const batch = writeBatch(db);
        videos.forEach((lecture) => {
          const lectureRef = doc(
            collection(db, "courses", courseId, "lectures"),
            lecture.id
          );
          batch.set(lectureRef, {
            ...lecture,
            order: lecture.originalPosition,
          });
        });

        await batch.commit();
        setMessage({ text: "Course added successfully", type: "success" });
      }

      // Refresh course list
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);

      resetForm();
    } catch (err) {
      console.error(err);
      setMessage({
        text: `Failed to ${editMode ? "update" : "add"} course: ${err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setCourseData({ ...courseData, thumbnail: e.target.files[0] });
    }
  };

  const handleDeleteClick = (id) => {
    setCurrentCourseId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "courses", currentCourseId));
      setCourses(courses.filter((course) => course.id !== currentCourseId));
      setMessage({ text: "Course deleted successfully", type: "success" });
    } catch (err) {
      console.error("Error deleting course: ", err);
      setMessage({ text: "Failed to delete course", type: "error" });
    } finally {
      setConfirmOpen(false);
      setCurrentCourseId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: "#00ADB5", fontWeight: "bold" }}
      >
        {editMode ? "Edit Course" : "Add New Course"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Course Form */}
        <Card
          sx={{
            p: 3,
            flex: 1,
            backgroundColor: "#121212",
            borderRadius: 3,
          }}
        >
          {message.text && (
            <Alert
              severity={message.type}
              sx={{ mb: 2 }}
              onClose={() => setMessage({ text: "", type: "" })}
            >
              {message.text}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {!editMode && (
              <CustomTextField
                label="YouTube Playlist URL"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                fullWidth
                margin="normal"
                required={!editMode}
                placeholder="https://www.youtube.com/playlist?list=..."
              />
            )}

            <CustomTextField
              label="Course Title"
              value={courseData.title}
              onChange={(e) =>
                setCourseData({ ...courseData, title: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />

            <CustomTextField
              label="Description"
              value={courseData.description}
              onChange={(e) =>
                setCourseData({ ...courseData, description: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <CustomTextField
              label="Category"
              value={courseData.category}
              onChange={(e) =>
                setCourseData({ ...courseData, category: e.target.value })
              }
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal" sx={{ color: "#EEEEEE" }}>
              <InputLabel sx={{ color: "#AAAAAA" }}>Academic Year *</InputLabel>
              <Select
                value={courseData.year}
                onChange={(e) =>
                  setCourseData({ ...courseData, year: e.target.value })
                }
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

            {courseData.year && (
              <Autocomplete
                multiple
                options={topicsByYear[courseData.year] || []}
                value={courseData.topics}
                onChange={(event, newValue) => {
                  setCourseData({ ...courseData, topics: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Topics"
                    placeholder="Choose topics"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ style: { color: "#AAAAAA" } }}
                    sx={{
                      input: { color: "#EEEEEE" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#333",
                        },
                        "&:hover fieldset": {
                          borderColor: "#00ADB5",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#00ADB5",
                        },
                      },
                    }}
                  />
                )}
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
              />
            )}

            <Box sx={{ mt: 2, mb: 3 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload sx={{ color: "#00ADB5" }} />}
                sx={{
                  mr: 2,
                  borderColor: "#00ADB5",
                  color: "#00ADB5",
                  "&:hover": {
                    backgroundColor: "rgba(0,173,181,0.1)",
                    borderColor: "#00ADB5",
                  },
                }}
              >
                Upload Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              <Typography component="span" sx={{ color: "#AAAAAA" }}>
                {courseData.thumbnail?.name ||
                  (courseData.thumbnailUrl && "Image selected") ||
                  "No image selected"}
              </Typography>
            </Box>

            {courseData.thumbnailUrl && (
              <CardMedia
                component="img"
                height="200"
                image={courseData.thumbnailUrl}
                alt="Course thumbnail preview"
                sx={{ mb: 2, borderRadius: 1, objectFit: "cover" }}
              />
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#00ADB5",
                  "&:hover": { backgroundColor: "#00838f" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : editMode ? (
                  "Update Course"
                ) : (
                  "Add Course"
                )}
              </Button>

              {editMode && (
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  sx={{
                    color: "#EEEEEE",
                    borderColor: "#393E46",
                    "&:hover": { borderColor: "#00ADB5", color: "#00ADB5" },
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Card>

        {/* Courses List */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" mb={2} sx={{ color: "#EEEEEE" }}>
            Existing Courses ({courses.length})
          </Typography>

          {courses.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#AAAAAA" }}>
              No courses found
            </Typography>
          ) : (
            <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
              {courses.map((course) => (
                <Card
                  key={course.id}
                  sx={{
                    mb: 2,
                    backgroundColor: "#121212",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    {course.thumbnail && (
                      <CardMedia
                        component="img"
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "4px 0 0 4px",
                        }}
                        image={course.thumbnail}
                        alt={course.title}
                      />
                    )}
                    <Box sx={{ p: 2, flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: "#EEEEEE" }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#AAAAAA" }}>
                        {course.year ? `Year ${course.year}` : ""} •{" "}
                        {course.totalLectures || 0} lectures
                      </Typography>
                      {course.topics?.length > 0 && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {course.topics.map((topic) => (
                            <Chip
                              key={topic}
                              label={topic}
                              size="small"
                              sx={{
                                backgroundColor: "#393E46",
                                color: "#EEEEEE",
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                      <IconButton onClick={() => handleEdit(course)}>
                        <Edit sx={{ color: "#00ADB5" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(course.id)}>
                        <Delete sx={{ color: "#FF5722" }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ color: "#EEEEEE", backgroundColor: "#121212" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#121212" }}>
          <Typography sx={{ color: "#AAAAAA" }}>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#121212" }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ color: "#EEEEEE" }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: "#FF5722" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCourses;
