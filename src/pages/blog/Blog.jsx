import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
  Container,
  CardActions,
} from "@mui/material";
import Header from "../../components/header/Header";
import { blogsData } from "../../blogsData";
import CustomButton from "../../components/CustomButton/CustomButton";
// import { useNavigate } from "react-router-dom";
import { BlogContext } from "../../context/BlogContext";

const Blog = () => {
  //   const navigate = useNavigate();
  const { blogs } = useContext(BlogContext);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#121212",
          minHeight: "100vh",
          py: 15,
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
          color: "red",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ color: "#00adb5" }}>
            Blog
          </Typography>
          <Typography variant="body1" color="gray" mb={4}>
            Explore educational articles, platform updates, and helpful study
            tips curated for university students.
          </Typography>
          <Grid container spacing={4} key={currentPage}>
            {currentPosts.map((post) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="white">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="gray" gutterBottom>
                      {post.date}
                    </Typography>
                    <Typography variant="body2" paragraph color="white">
                      {post.summary}
                    </Typography>
                    <CardActions sx={{ px: 2, pb: 2 }}>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              color: "red",
            }}
          >
            <Pagination
              count={Math.ceil(blogsData.length / postsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ ".MuiPaginationItem-text": { color: "white" } }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Blog;
