import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { blogsData } from "../../data/blogsData";
import CustomButton from "../CustomButton/CustomButton";

const BlogSection = () => {
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
          sx={{ color: "#00ADB5", fontWeight: "bold", mb: 6 }}
        >
          Explore Educational Insights
        </Typography>

        <Grid container spacing={4}>
          {blogsData.slice(0, 3).map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
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
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CustomButton to={"/blog"}>View all blogs</CustomButton>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection;
