import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#1e1e1e", color: "#cccccc", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#00ADB5", fontWeight: "bold", mb: 1 }}
            >
              Unilearn
            </Typography>
            <Typography variant="body2">
              Your all-in-one study platform to keep you organized, motivated,
              and connected with the best online resources.
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {["Home", "About", "My Courses", "Blog", "Contact"].map(
                (text) => (
                  <Link
                    key={text}
                    href={`/${text.toLowerCase().replace(" ", "")}`}
                    underline="none"
                    sx={{
                      color: "#cccccc",
                      "&:hover": { color: "#00ADB5" },
                      transition: "0.3s",
                    }}
                  >
                    {text}
                  </Link>
                )
              )}
            </Box>
          </Grid>

          {/* Social media */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Follow Us
            </Typography>
            <Box>
              {[Facebook, Twitter, LinkedIn, YouTube].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: "#cccccc",
                    "&:hover": { color: "#00ADB5" },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{ textAlign: "center", mt: 4, fontSize: 14, color: "#888888" }}
        >
          © {new Date().getFullYear()} Unilearn. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
