import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
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
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { resourcesData } from "../../data/resourcesData";
import Header from "../../components/header/Header";

import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

const typeIcons = {
  PDF: <PictureAsPdfIcon />,
  Video: <OndemandVideoIcon />,
  Link: <LinkIcon />,
};

const filterOptions = ["All", "PDF", "Video", "Link"];

const itemsPerPage = 6;

const Resources = () => {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return filter === "All"
      ? resourcesData
      : resourcesData.filter((res) => res.type === filter);
  }, [filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const handleClick = () => {
    window.open(resourcesData.url, "_blank");
  };

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
                onClick={() => setFilter(option)}
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
                <Card
                  sx={{
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    borderRadius: 2,
                    height: "100%",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      {typeIcons[res.type]}
                      <Typography variant="h6">{res.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="#cccccc">
                      {res.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={handleClick}
                      target="_blank"
                      rel="noopener"
                      sx={{ color: "#00ADB5" }}
                    >
                      {res.type === "PDF" ? "Download" : "Open"}
                    </Button>
                  </CardActions>
                </Card>
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
