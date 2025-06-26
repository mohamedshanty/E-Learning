import React from "react";
import {
  Box,
  Typography,
  Stack,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import assets from "../../assets/assets";
import CustomButton from "../CustomButton/CustomButton";

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = "#00ADB5";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
      id="home"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            pt: 18,
            pb: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            style={{ maxWidth: isMobile ? "100%" : 400 }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: primaryColor, mb: 2 }}
            >
              Learn Anytime, Anywhere.
            </Typography>
            <Typography variant="body1" sx={{ color: "#aaaaaa", mb: 4 }}>
              Join thousands of learners and unlock your potential with our
              expert-led online courses tailored just for you.
            </Typography>

            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{
                width: "100%",
                alignItems: isMobile ? "stretch" : "flex-start",
              }}
            >
              <CustomButton to="/courses" fullWidth={isMobile}>
                Browse Courses
              </CustomButton>
              <CustomButton to="/" variant="outlined" fullWidth={isMobile}>
                Get Started
              </CustomButton>
            </Stack>
          </motion.div>

          <motion.img
            src={assets.hero1}
            alt="Hero"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            style={{
              maxWidth: 500,
              width: "100%",
              marginTop: isMobile ? "3rem" : 0,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
