import React from "react";
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import assets from "../../assets/assets";

const listItems = [
  "Track your progress easily",
  "Save and organize your lectures",
  "Access external resources and summaries",
  "Built for university students",
];

const AboutSection = () => {
  return (
    <Box
      id="about"
      sx={{
        background: "linear-gradient(to bottom, #101624, #0A0A0A)",
        position: "relative",
        py: 12,
        mt: "-2px",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ flex: 1 }}
          >
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
              {listItems.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: "#00ADB5" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ sx: { color: "white" } }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <Box
              component="img"
              src={assets.about}
              alt="About UniLearn"
              sx={{
                width: "100%",
                maxWidth: 500,
                display: "block",
                borderRadius: 2,
              }}
            />
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;
