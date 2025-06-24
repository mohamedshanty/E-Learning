import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  Skeleton,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  MenuBook as MenuBookIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

const Welcome = () => {
  const theme = useTheme();
  const [counts, setCounts] = useState({
    users: 0,
    blogs: 0,
    courses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCounts = useCallback(async () => {
    setRefreshing(true);
    try {
      const [usersSnap, blogsSnap, coursesSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "blogs")),
        getDocs(collection(db, "courses")),
      ]);

      setCounts({
        users: usersSnap.size,
        blogs: blogsSnap.size,
        courses: coursesSnap.size,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const statCards = [
    {
      title: "Total Users",
      value: counts.users,
      icon: <PeopleIcon fontSize="large" />,
      description: "Registered platform users",
      color: "#00ADB5",
    },
    {
      title: "Total Articles",
      value: counts.blogs,
      icon: <ArticleIcon fontSize="large" />,
      description: "Published blog posts",
      color: "#00ADB5",
    },
    {
      title: "Total Courses",
      value: counts.courses,
      icon: <MenuBookIcon fontSize="large" />,
      description: "Available learning courses",
      color: "#00ADB5",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1400,
        mx: "auto",
        backgroundColor: "#0A0A0A",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        border: "1px solid #393E46",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#00ADB5",
              mb: 1,
            }}
          >
            👋 {getGreeting()}, Admin
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#AAAAAA",
              fontWeight: 400,
            }}
          >
            Platform overview and quick statistics
          </Typography>
        </Box>

        <Tooltip title="Refresh statistics">
          <IconButton
            onClick={fetchCounts}
            disabled={refreshing}
            sx={{
              color: "#00ADB5",
              backgroundColor: "rgba(0, 173, 181, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(0, 173, 181, 0.2)",
              },
            }}
          >
            <RefreshIcon
              sx={{
                transform: refreshing ? "rotate(360deg)" : "none",
                transition: refreshing ? "transform 1s linear" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Skeleton
                variant="rectangular"
                height={180}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#1e1e1e",
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((stat, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#1e1e1e",
                    borderLeft: `4px solid ${stat.color}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.6)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        mr: 2,
                        backgroundColor: "rgba(0, 173, 181, 0.1)",
                        borderRadius: "50%",
                        display: "flex",
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        color: "#EEEEEE",
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#EEEEEE",
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#AAAAAA",
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Welcome;
