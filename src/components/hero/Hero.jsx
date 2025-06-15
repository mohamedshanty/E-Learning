import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
        py: { xs: 5, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            pt: 18,
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: 400 } }}>
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
          </Box>

          <Box
            component="img"
            src={assets.hero1}
            alt="Hero"
            sx={{
              maxWidth: 500,
              width: "100%",
              mt: isMobile ? 5 : 0,
              background: "transparent",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
