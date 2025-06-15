import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import assets from "../../assets/assets";

const AboutSection = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #101624,#0A0A0A )",
        py: 10,
        mt: -2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              sx={{ color: "#00ADB5", fontWeight: "bold", mb: 2 }}
            >
              About UniLearn
            </Typography>
            <Typography variant="body1" sx={{ color: "#aaaaaa", mb: 3 }}>
              UniLearn was created to help university students easily access and
              organize their online lectures. Instead of wasting time searching
              for content across platforms, students can track their progress,
              save lectures, and study smarter.
            </Typography>

            <List>
              {[
                "Track your progress easily",
                "Save and organize your lectures",
                "Access external resources and summaries",
                "Built for university students",
              ].map((text, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: "#00ADB5" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ sx: { color: "white" } }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={assets.about}
              alt="About UniLearn"
              sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                display: "block",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
