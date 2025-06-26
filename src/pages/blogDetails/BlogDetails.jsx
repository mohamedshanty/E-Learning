import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import Header from "../../components/header/Header";
import { BlogContext } from "../../context/BlogContext";
import CustomButton from "../../components/CustomButton/CustomButton";

const BlogDetails = () => {
  const { id } = useParams();
  const { blogs } = useContext(BlogContext);

  const blog = blogs.find((item) => item.id === id);
  const related = blogs.filter((item) => item.id !== id).slice(0, 3);

  if (!blog)
    return (
      <Container sx={{ py: 10 }}>
        <Typography color="error" variant="h5">
          Blog not found.
        </Typography>
      </Container>
    );

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
            {blog.title}
          </Typography>
          <Typography variant="body2" color="gray" gutterBottom>
            {blog.date}
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            mt={4}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1a1a1a",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                maxWidth: 500,
              }}
            >
              <CardMedia
                component="img"
                image={blog.image}
                alt={blog.title}
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  borderRadius: 2,
                  p: 2,
                  py: 0,
                }}
              />
            </Box>

            <Box flex={1} color="white">
              <Typography variant="h6" gutterBottom>
                Blog Overview
              </Typography>
              <Typography variant="body2" color="gray">
                {blog.summary}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            color="white"
            paragraph
            sx={{ mt: 4, whiteSpace: "pre-line" }}
          >
            {blog.content}
          </Typography>

          <Divider sx={{ my: 5, borderColor: "#444" }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#00adb5", mb: 4 }}
          >
            Related Articles
          </Typography>
          <Grid container spacing={3}>
            {related.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" gutterBottom color="gray">
                      {item.date}
                    </Typography>
                    <Typography variant="body2" paragraph color="white">
                      {item.summary}
                    </Typography>
                    <CardActions sx={{ p: 0, pt: 1 }}>
                      <CustomButton
                        variant="outlined"
                        to={`/blog/${item.id}`}
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
        </Container>
      </Box>
    </>
  );
};

export default BlogDetails;
