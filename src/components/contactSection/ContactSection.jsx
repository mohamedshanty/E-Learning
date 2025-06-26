import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import toast from "react-hot-toast";
import assets from "../../assets/assets";
import CustomButton from "../CustomButton/CustomButton";
import CustomTextField from "../customTextField/CustomTextField";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ContactSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0}
        >
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
        </motion.div>

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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={1}
            style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}
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
          </motion.div>

          {/* Right side: Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={2}
            style={{
              flex: 1,
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                backgroundColor: "#1e1e1e",
                borderRadius: 2,
                py: 4,
                px: { xs: 2, md: 4 },
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

                <CustomButton type="submit">Send Message</CustomButton>
              </Stack>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactSection;
