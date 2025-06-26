import React, { useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import LinkIcon from "@mui/icons-material/Link";
import CustomButton from "../CustomButton/CustomButton";
import { motion } from "framer-motion";
import { ResourcesContext } from "../../context/ResourcesContext ";

const typeIcons = {
  PDF: <PictureAsPdfIcon />,
  Video: <OndemandVideoIcon />,
  Link: <LinkIcon />,
};

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

const ResourcesSection = () => {
  const { resources } = useContext(ResourcesContext);
  const latestResources = resources.slice(0, 3);

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #0A0A0A, #101624)",
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
            sx={{ color: "#00ADB5", fontWeight: "bold", mb: 4 }}
          >
            Helpful Resources for Your Studies
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {latestResources.map((res, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={res.id}>
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
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 2 }}
                    >
                      {typeIcons[res.type]}
                      <Typography variant="h6">{res.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="#cccccc">
                      {res.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      href={res.url}
                      target="_blank"
                      rel="noopener"
                      sx={{ color: "#00ADB5" }}
                    >
                      {res.type === "PDF" ? "Download" : "Open"}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CustomButton to="/resources">View All resources</CustomButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResourcesSection;
