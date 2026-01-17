import React, { useContext, useState } from "react";
import { WatchLaterContext } from "../../context/WatchLaterContext";
import Header from "../../components/header/Header";
import {
  ListItemText,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import CustomButton from "../../components/CustomButton/CustomButton";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";

const WatchLater = () => {
  const { watchLaterVideos, removeFromWatchLater } =
    useContext(WatchLaterContext);
  const [selected, setSelected] = useState(watchLaterVideos[0] || null);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#121212",
          minHeight: "100vh",
          py: 15,
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          color: "red",
        }}
      >
        <Container maxWidth="lg">
          {watchLaterVideos.length === 0 ? (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: { xs: 4, md: 6 },
                  // maxWidth: 500,
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <VideoLibraryOutlinedIcon
                  sx={{ fontSize: 70, color: "#00ADB5", mb: 2 }}
                />

                <Typography
                  variant="h5"
                  sx={{ color: "#fff", fontWeight: 600, mb: 1 }}
                >
                  No videos saved yet
                </Typography>

                <Typography variant="body2" sx={{ color: "#bbb", mb: 3 }}>
                  Save videos to your Watch Later list and come back anytime to
                  continue learning.
                </Typography>

                <CustomButton
                  to="/courses"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.2,
                    fontWeight: 600,
                  }}
                >
                  Browse Courses
                </CustomButton>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ height: "100%" }}>
              <Grid size={{ xs: 12, md: 8 }}>
                {selected ? (
                  <Box>
                    <Typography variant="h5" mb={2} sx={{ color: "#fff" }}>
                      {selected.courseTitle}
                    </Typography>
                    <ReactPlayer
                      url={selected.videoUrl}
                      controls
                      width="100%"
                    />
                    <Typography variant="h6" sx={{ color: "#fff", mt: 2 }}>
                      {selected.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
                      {selected.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/courses/${selected.courseId}`)}
                    >
                      Go to Course
                    </Button>
                  </Box>
                ) : (
                  <Typography>Select a video to watch</Typography>
                )}
              </Grid>

              <Grid
                size={{ xs: 12, md: 4 }}
                sx={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                <Typography variant="h6" mb={2} sx={{ color: "#fff" }}>
                  Saved Videos ({watchLaterVideos.length})
                </Typography>

                <List
                  sx={{ backgroundColor: "#1e1e1e", borderRadius: 2, p: 0 }}
                >
                  {watchLaterVideos.map((video, index) => (
                    <React.Fragment key={`${video.id}-${video.courseId}`}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          pr: 1,
                          "&:hover": {
                            backgroundColor: "#00ADB5",
                            cursor: "pointer",
                            color: "#fff",
                            borderRadius: 2,
                          },
                        }}
                      >
                        <ListItem
                          button={true}
                          selected={selected?.id === video.id}
                          onClick={() => setSelected(video)}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: "#00ADB5",
                            },
                          }}
                        >
                          <ListItemText
                            sx={{
                              color: "#fff",
                              ".MuiListItemText-secondary": {
                                color: "#777",
                              },
                            }}
                            primary={video.title}
                            secondary={video.courseTitle}
                          />
                        </ListItem>
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchLater(video.id, video.courseId);
                            if (selected?.id === video.id) setSelected(null);
                          }}
                          sx={{
                            background: "transparent",
                            "&:hover": { background: "transparent" },
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                      {index < watchLaterVideos.length - 1 && (
                        <Divider sx={{ borderColor: "#3b3b3b" }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};
export default WatchLater;
