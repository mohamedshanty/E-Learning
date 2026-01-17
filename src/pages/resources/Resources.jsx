import React, { useMemo, useState, useContext } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Stack,
  Chip,
  Pagination,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import Header from "../../components/header/Header";
import { ResourcesContext } from "../../context/ResourcesContext ";

const typeIcons = {
  PDF: <PictureAsPdfIcon />,
  Video: <OndemandVideoIcon />,
  Link: <LinkIcon />,
};

const filterOptions = ["All", "PDF", "Video", "Link"];
const itemsPerPage = 6;

const Resources = () => {
  const { resources } = useContext(ResourcesContext);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return filter === "All"
      ? resources
      : resources.filter((res) => res.type === filter);
  }, [resources, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

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
          <Typography variant="h3" gutterBottom sx={{ color: "#00ADB5" }}>
            Useful Resources
          </Typography>
          <Typography variant="body1" color="gray" mb={4}>
            Find all the links, PDFs, and videos recommended for your courses in
            one place.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            {filterOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                onClick={() => {
                  setFilter(option);
                  setPage(1);
                }}
                sx={{
                  backgroundColor: filter === option ? "#00ADB5" : "#1e1e1e",
                  color: filter === option ? "#ffffff" : "#aaaaaa",
                  "&:hover": {
                    backgroundColor: "#00ADB5",
                    color: "#ffffff",
                  },
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>

          <Grid container spacing={4}>
            {paginated.map((res) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={res.id}>
                <Box sx={{ height: "100%", display: "flex" }}>
                  <Card
                    sx={{
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 2,
                          height: "56px",
                        }}
                      >
                        <Box
                          sx={{
                            color: "#00ADB5",
                            flexShrink: 0,
                            mt: 0.5,
                          }}
                        >
                          {typeIcons[res.type]}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {res.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          height: "100px",
                          overflow: "hidden",
                          position: "relative",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#cccccc",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 4,
                            maxHeight: "6.4em",
                          }}
                        >
                          {res.description}
                        </Typography>

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2em",
                            background:
                              "linear-gradient(to bottom, transparent, #1e1e1e)",
                            pointerEvents: "none",
                          }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => window.open(res.url, "_blank")}
                        sx={{ color: "#00ADB5" }}
                      >
                        {res.type === "PDF" ? "Download" : "Open"}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>

          {filtered.length > itemsPerPage && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(filtered.length / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  color: "white",
                  ".MuiPaginationItem-text": { color: "white" },
                  ".MuiPaginationItem-page.Mui-selected": {
                    background: "#00ADB5",
                  },
                  ".MuiPaginationItem-page.Mui-selected:hover": {
                    background: "#00ADB5",
                  },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Resources;
