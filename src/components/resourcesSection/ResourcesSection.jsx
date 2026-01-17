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
      id="resources"
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
                style={{ height: "100%" }}
              >
                <Box sx={{ height: "100%", display: "flex" }}>
                  <Card
                    sx={{
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 2,
                          height: "56px", // ارتفاع ثابت للعنوان
                        }}
                      >
                        <Box
                          sx={{
                            color: "#00ADB5",
                            flexShrink: 0,
                            mt: 0.5,
                          }}
                        >
                          {typeIcons[res.type]}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {res.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          height: "100px", // ارتفاع ثابت للوصف
                          overflow: "hidden",
                          position: "relative",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#cccccc",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 4,
                            maxHeight: "6.4em", // 4 أسطر * 1.6 line-height
                          }}
                        >
                          {res.description}
                        </Typography>

                        {/* تأثير التلاشي فقط إذا كان النص طويلاً */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2em",
                            background:
                              "linear-gradient(to bottom, transparent, #1e1e1e)",
                            pointerEvents: "none",
                          }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        href={res.url}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: "#00ADB5",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "rgba(0, 173, 181, 0.1)",
                          },
                        }}
                      >
                        {res.type === "PDF" ? "Download" : "Open"}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
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
