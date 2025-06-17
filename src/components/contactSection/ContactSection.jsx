import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import toast from "react-hot-toast";
import assets from "../../assets/assets";
import CustomButton from "../CustomButton/CustomButton";
import CustomTextField from "../customTextField/CustomTextField";

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // البيانات صالحة لأن المتصفح تحقق منها بسبب "required"
    toast.success("Your message has been sent successfully!");

    console.log("Message sent:", form);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #101624,#0A0A0A)",
        py: 10,
        mt: -2,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            color: "#00ADB5",
            fontWeight: "bold",
            mb: 6,
            textAlign: "center",
          }}
        >
          Contact Us
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Left side: Image + motivational message */}
          <Box
            sx={{
              flex: 1,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <Box
              component="img"
              src={assets.contact1}
              alt="Contact Support"
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 3,
                mb: 3,
                background: "transparent",
              }}
            />

            <Typography
              variant="h6"
              sx={{ color: "#bbbbbb", fontStyle: "italic", lineHeight: 1.5 }}
            >
              Have questions or need assistance? We're here to help you anytime.
              Your success is our priority — just send us a message and we'll
              respond promptly!
            </Typography>
          </Box>

          {/* Right side: Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              py: 4,
              px: { xs: 2, md: 4 },
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Stack spacing={3} sx={{ width: "100%" }}>
              <CustomTextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                sx={{ backgroundColor: "#2a2a2a" }}
                required
              />
              <CustomTextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                sx={{ backgroundColor: "#2a2a2a" }}
                required
              />
              <CustomTextField
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                sx={{ backgroundColor: "#2a2a2a" }}
                required
                multiline
                rows={4}
              />

              <CustomButton
                type="submit"
                // onClick={
                //   // toast.success("Your message has been sent successfully!")
                // }
              >
                Send Message
              </CustomButton>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactSection;
