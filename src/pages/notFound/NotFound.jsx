import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import Header from "../../components/header/Header";

const NotFound = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          py: 15,
          background: "linear-gradient(to bottom, #0A0A0A, #101624)",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h2" color={"white"}>
            404
          </Typography>
          <Typography variant="h5" mb={2} color={"white"}>
            Page Not Found
          </Typography>
          <CustomButton to={"/home"}>Go Home</CustomButton>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
