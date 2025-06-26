import React, { useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { BlogContext } from "../../context/BlogContext";
import CustomButton from "../CustomButton/CustomButton";

const BlogSection = () => {
  const { blogs } = useContext(BlogContext);
  const topBlogs = blogs ? blogs.slice(0, 3) : [];

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
        >
          <Typography
            variant="h4"
            sx={{ color: "#00ADB5", fontWeight: "bold", mb: 6 }}
          >
            Explore Educational Insights
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {blogs === null ? (
            [1, 2, 3].map((n) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton height={30} />
                <Skeleton height={20} width="80%" />
              </Grid>
            ))
          ) : topBlogs.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" color="gray">
                No blog posts available at the moment.
              </Typography>
            </Grid>
          ) : (
            topBlogs.map((post, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card
                    sx={{
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={post.image}
                      alt={post.title}
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="#aaaaaa" gutterBottom>
                        {post.date}
                      </Typography>
                      <Typography variant="body2" color="#cccccc">
                        {post.summary}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <CustomButton
                        variant="outlined"
                        to={`/blog/${post.id}`}
                        sx={{
                          fontSize: "0.75rem",
                          px: 2,
                          py: 0.5,
                          borderWidth: "1px",
                        }}
                      >
                        Read More
                      </CustomButton>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>

        {topBlogs.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <CustomButton to={"/blog"}>View all blogs</CustomButton>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default BlogSection;
