import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Hero from "../../components/hero/Hero";
import AboutSection from "../../components/about/AboutSection";
import MyCoursesSection from "../../components/myCourses/MyCoursesSection";
import BlogSection from "../../components/blogSection/BlogSection";
import ResourcesSection from "../../components/resourcesSection/ResourcesSection";
import ContactSection from "../../components/contactSection/ContactSection";
import Footer from "../../components/footer/Footer";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.substring(1);
    const section = document.getElementById(id);

    if (section) {
      requestAnimationFrame(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location]);

  return (
    <Box component={"main"}>
      <Header />
      <Box component={"section"} id="home">
        <Hero />
      </Box>
      <Box component={"section"} id="about">
        <AboutSection />
      </Box>
      <Box component={"section"} id="my-courses" sx={{ mt: -2 }}>
        <MyCoursesSection />
      </Box>
      <Box component={"section"} id="blog">
        <BlogSection />
      </Box>
      <Box component={"section"} id="resources">
        <ResourcesSection />
      </Box>
      <Box component={"section"} id="contact-us">
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
