import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { Delete, Edit, CloudUpload } from "@mui/icons-material";

const AdminBlogUpload = () => {
  const [form, setForm] = useState({
    id: "",
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: [],
    image: null,
    imageUrl: "",
    readTime: "5 min",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  const categories = [
    "Technology",
    "Education",
    "Science",
    "Health",
    "Business",
  ];
  const tagOptions = ["React", "Firebase", "MUI", "JavaScript", "CSS", "HTML"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogList);
      } catch (err) {
        console.error("Error fetching blogs: ", err);
        setMessage({ text: "Failed to load blogs", type: "error" });
      }
    };
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setForm({
      ...form,
      tags: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleEdit = (blog) => {
    setForm({
      id: blog.id,
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      category: blog.category || "",
      tags: blog.tags || [],
      image: null,
      imageUrl: blog.image || "",
      readTime: blog.readTime || "5 min",
    });
    setEditMode(true);
  };

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      summary: "",
      content: "",
      category: "",
      tags: [],
      image: null,
      imageUrl: "",
      readTime: "5 min",
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let imageUrl = form.imageUrl;
      if (form.image) {
        imageUrl = await uploadImageToCloudinary(form.image);
      }

      const blogData = {
        title: form.title,
        summary: form.summary,
        content: form.content,
        category: form.category,
        tags: form.tags,
        image: imageUrl,
        readTime: form.readTime,
        date: new Date().toISOString().split("T")[0],
        updatedAt: Timestamp.now(),
      };

      if (editMode) {
        await updateDoc(doc(db, "blogs", form.id), blogData);
        setMessage({ text: "Blog updated successfully", type: "success" });
      } else {
        blogData.createdAt = Timestamp.now();
        await addDoc(collection(db, "blogs"), blogData);
        setMessage({ text: "Blog published successfully", type: "success" });
      }

      // Refresh blog list
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);

      resetForm();
    } catch (err) {
      console.error(err);
      setMessage({
        text: `Failed to ${editMode ? "update" : "publish"} blog`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCurrentBlogId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "blogs", currentBlogId));
      setBlogs(blogs.filter((blog) => blog.id !== currentBlogId));
      setMessage({ text: "Blog deleted successfully", type: "success" });
    } catch (err) {
      console.error("Error deleting blog: ", err);
      setMessage({ text: "Failed to delete blog", type: "error" });
    } finally {
      setConfirmOpen(false);
      setCurrentBlogId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: "#00ADB5", fontWeight: "bold" }}
      >
        {editMode ? "Edit Blog Post" : "Create New Blog Post"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Blog Form */}
        <Card
          sx={{
            p: 3,
            flex: 1,
            backgroundColor: "#121212",
            borderRadius: 3,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={form.title}
              onChange={handleChange}
              required
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

            <TextField
              label="Summary"
              name="summary"
              fullWidth
              margin="normal"
              value={form.summary}
              onChange={handleChange}
              required
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

            <TextField
              label="Content"
              name="content"
              multiline
              rows={6}
              fullWidth
              margin="normal"
              value={form.content}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: "#AAAAAA" } }}
              sx={{
                textarea: { color: "#EEEEEE" },
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

            <FormControl fullWidth margin="normal" sx={{ color: "#EEEEEE" }}>
              <InputLabel sx={{ color: "#AAAAAA" }}>Category</InputLabel>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                label="Category"
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
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{ color: "#000" }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ color: "#EEEEEE" }}>
              <InputLabel sx={{ color: "#AAAAAA" }}>Tags</InputLabel>
              <Select
                multiple
                name="tags"
                value={form.tags}
                onChange={handleTagChange}
                label="Tags"
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
                {tagOptions.map((tag) => (
                  <MenuItem key={tag} value={tag} sx={{ color: "#000" }}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Read Time"
              name="readTime"
              fullWidth
              margin="normal"
              value={form.readTime}
              onChange={handleChange}
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
                Upload Image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </Button>
              <Typography component="span" sx={{ color: "#AAAAAA" }}>
                {form.image?.name || (form.imageUrl && "Image selected")}
              </Typography>
            </Box>

            {form.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={form.imageUrl}
                alt="Blog preview"
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
                  "Update Post"
                ) : (
                  "Publish Post"
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

            {message.text && (
              <Alert
                severity={message.type}
                sx={{ mt: 2 }}
                onClose={() => setMessage({ text: "", type: "" })}
              >
                {message.text}
              </Alert>
            )}
          </form>
        </Card>

        {/* Blog List */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" mb={2} sx={{ color: "#EEEEEE" }}>
            Existing Blog Posts
          </Typography>

          {blogs.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#AAAAAA" }}>
              No blog posts found
            </Typography>
          ) : (
            <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
              {blogs.map((blog) => (
                <Card
                  key={blog.id}
                  sx={{
                    mb: 2,
                    backgroundColor: "#121212",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    {blog.image && (
                      <CardMedia
                        component="img"
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "4px 0 0 4px",
                        }}
                        image={blog.image}
                        alt={blog.title}
                      />
                    )}
                    <Box sx={{ p: 2, flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: "#EEEEEE" }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#AAAAAA" }}>
                        {blog.date} • {blog.category}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                      <IconButton>
                        <Edit
                          sx={{ color: "#00ADB5" }}
                          onClick={() => handleEdit(blog)}
                        />
                      </IconButton>
                      <IconButton>
                        <Delete
                          sx={{ color: "#FF5722" }}
                          onClick={() => handleDeleteClick(blog.id)}
                        />
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
            Are you sure you want to delete this blog post? This action cannot
            be undone.
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

export default AdminBlogUpload;
