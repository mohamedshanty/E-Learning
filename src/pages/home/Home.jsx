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
    const hash = location.hash;
    if (hash) {
      const section = document.querySelector(hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 100); // تأخير بسيط بعد التنقل
      }
    }
  }, [location]);

  return (
    <Box component={"main"} id="home">
      <Header />
      <Box component={"section"} id="home">
        <Hero />
      </Box>
      <Box component={"section"} id="about">
        <AboutSection />
      </Box>
      <Box component={"section"} id="my-courses">
        <MyCoursesSection />
      </Box>
      <Box component={"section"} id="blog">
        <BlogSection />
      </Box>
      <Box component={"section"} id="resouces">
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
