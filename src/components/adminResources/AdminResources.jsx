import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { ResourcesContext } from "../../context/ResourcesContext ";

const resourceTypes = ["PDF", "Video", "Link"];

const AdminResources = () => {
  const { addResource } = useContext(ResourcesContext);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Link");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !url || !type) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await addResource({ title, url, description, type });
      setTitle("");
      setUrl("");
      setDescription("");
      setType("Link");
      alert("Resource added successfully");
    } catch (error) {
      console.error("Failed to add resource:", error);
      alert("An error occurred while adding the resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} color="primary">
          Add New Resource
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
          >
            {resourceTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={loading}
              sx={{ px: 5 }}
            >
              {loading ? "Adding..." : "Add Resource"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AdminResources;
