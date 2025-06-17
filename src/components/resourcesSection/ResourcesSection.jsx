import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import LinkIcon from "@mui/icons-material/Link";
import { resourcesData } from "../../data/resourcesData";
import CustomButton from "../CustomButton/CustomButton";

const typeIcons = {
  PDF: <PictureAsPdfIcon />,
  Video: <OndemandVideoIcon />,
  Link: <LinkIcon />,
};

const ResourcesSection = () => {
  const [filter] = useState("All");

  const filteredResources =
    filter === "All"
      ? resourcesData
      : resourcesData.filter((res) => res.type === filter);

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        py: 10,
        mt: -2,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ color: "#00ADB5", fontWeight: "bold", mb: 4 }}
        >
          Helpful Resources for Your Studies
        </Typography>

        <Grid container spacing={4}>
          {filteredResources.slice(0, 3).map((res) => (
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
                    href={res.link}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <CustomButton to={"/resources"}>View All resources</CustomButton>
        </Box>
      </Container>
    </Box>
  );
};

export default ResourcesSection;
