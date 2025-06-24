import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { ResourcesContext } from "../../context/ResourcesContext ";

const resourceTypes = ["PDF", "Video", "Link"];

const AdminLinks = () => {
  const { resources, addResource, deleteResource, updateResource } =
    useContext(ResourcesContext);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Link");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    if (!title || !url || !type) {
      setMessage({ text: "Please fill in all required fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const resourceData = { title, url, description, type };

      if (editMode && currentResource) {
        await updateResource(currentResource.id, resourceData);
        setMessage({ text: "Resource updated successfully", type: "success" });
      } else {
        await addResource(resourceData);
        setMessage({ text: "Resource added successfully", type: "success" });
      }

      resetForm();
    } catch (error) {
      console.error("Operation failed:", error);
      setMessage({
        text: `Failed to ${editMode ? "update" : "add"} resource`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setCurrentResource(resource);
    setTitle(resource.title);
    setUrl(resource.url);
    setDescription(resource.description || "");
    setType(resource.type);
    setEditMode(true);
  };

  const handleDeleteClick = (id) => {
    setCurrentResource(resources.find((r) => r.id === id));
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteResource(currentResource.id);
      setMessage({ text: "Resource deleted successfully", type: "success" });
    } catch (error) {
      console.error("Failed to delete resource:", error);
      setMessage({ text: "Failed to delete resource", type: "error" });
    } finally {
      setConfirmOpen(false);
      setCurrentResource(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setType("Link");
    setEditMode(false);
    setCurrentResource(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: "#00ADB5", fontWeight: "bold" }}
      >
        Resources Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Resource Form */}
        <Card
          sx={{
            p: 3,
            flex: 1,
            backgroundColor: "#121212",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" mb={2} sx={{ color: "#EEEEEE" }}>
            {editMode ? "Edit Resource" : "Add New Resource"}
          </Typography>

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
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

            <TextField
              label="URL *"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
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

            <FormControl fullWidth sx={{ color: "#EEEEEE" }}>
              <InputLabel sx={{ color: "#AAAAAA" }}>Type *</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type *"
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
                {resourceTypes.map((option) => (
                  <MenuItem key={option} value={option} sx={{ color: "#000" }}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: "#00ADB5",
                  "&:hover": { backgroundColor: "#00838f" },
                  flex: 1,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : editMode ? (
                  "Update Resource"
                ) : (
                  "Add Resource"
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
                    flex: 1,
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Card>

        {/* Resources List */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" mb={2} sx={{ color: "#EEEEEE" }}>
            Existing Resources ({resources.length})
          </Typography>

          {resources.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#AAAAAA" }}>
              No resources found
            </Typography>
          ) : (
            <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
              <List>
                {resources.map((resource) => (
                  <Card
                    key={resource.id}
                    sx={{
                      mb: 2,
                      backgroundColor: "#121212",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: "#EEEEEE" }}>
                            {resource.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Box
                              component="span"
                              display="block"
                              sx={{ color: "#AAAAAA" }}
                            >
                              {resource.url}
                            </Box>
                            <Box
                              component="span"
                              display="block"
                              sx={{ color: "#AAAAAA" }}
                            >
                              Type: {resource.type}
                            </Box>
                            {resource.description && (
                              <Box
                                component="span"
                                display="block"
                                sx={{ color: "#AAAAAA" }}
                              >
                                {resource.description}
                              </Box>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEdit(resource)}
                          sx={{ color: "#00ADB5" }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteClick(resource.id)}
                          sx={{ color: "#FF5722" }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Card>
                ))}
              </List>
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
            Are you sure you want to delete "{currentResource?.title}"? This
            action cannot be undone.
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

export default AdminLinks;
