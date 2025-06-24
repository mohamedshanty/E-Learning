import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import assets from "../../assets/assets";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";
import {
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  School as StudentIcon,
} from "@mui/icons-material";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const data = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      // Update local state instead of refetching
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Error updating role");
    }
  };

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((user) => (user.role || "student") === roleFilter);

  const RoleChip = ({ role }) => (
    <Chip
      label={role}
      size="small"
      icon={role === "admin" ? <AdminIcon /> : <StudentIcon />}
      sx={{
        backgroundColor: role === "admin" ? "#00ADB520" : "#393E4620",
        color: role === "admin" ? "#00ADB5" : "#EEEEEE",
        fontWeight: 600,
      }}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
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
            👥 Users Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#AAAAAA",
              fontWeight: 400,
            }}
          >
            View and manage all registered users
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh users">
            <IconButton
              onClick={fetchUsers}
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
      </Box>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: "#AAAAAA" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterIcon fontSize="small" />
              <span>Filter by Role</span>
            </Box>
          </InputLabel>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            label="Filter by Role"
            sx={{
              color: "#EEEEEE",
              backgroundColor: "#1e1e1e",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#393E46",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#00ADB5",
              },
            }}
          >
            <MenuItem value="all">All Users ({users.length})</MenuItem>
            <MenuItem value="admin">
              Admins ({users.filter((u) => u.role === "admin").length})
            </MenuItem>
            <MenuItem value="student">
              Students (
              {users.filter((u) => !u.role || u.role === "student").length})
            </MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ color: "#AAAAAA" }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
      </Box>

      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#00ADB5" }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#1e1e1e",
            border: "1px solid #393E46",
            borderRadius: 2,
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0A0A0A" }}>
                {!isMobile && (
                  <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                    Avatar
                  </TableCell>
                )}
                <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                  Name
                </TableCell>
                {!isTablet && (
                  <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                    Email
                  </TableCell>
                )}
                <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                  Role
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    sx={{ color: "#EEEEEE", textAlign: "center", py: 4 }}
                  >
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 173, 181, 0.05)",
                      },
                    }}
                  >
                    {!isMobile && (
                      <TableCell>
                        <Avatar
                          src={
                            user.photoURL || user.avatar || assets.avatar_icon
                          }
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2px solid #00ADB5",
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell sx={{ color: "#EEEEEE" }}>
                      <Box>
                        <Typography fontWeight={600}>
                          {user.displayName || user.fullName || "No Name"}
                        </Typography>
                        {isTablet && (
                          <Typography variant="body2" sx={{ color: "#AAAAAA" }}>
                            {user.email}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {!isTablet && (
                      <TableCell sx={{ color: "#EEEEEE" }}>
                        {user.email}
                      </TableCell>
                    )}
                    <TableCell>
                      <Select
                        value={user.role || "student"}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        size="small"
                        sx={{
                          color: "#EEEEEE",
                          backgroundColor: "#0A0A0A",
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "#393E46",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#00ADB5",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#00ADB5",
                          },
                        }}
                        renderValue={(selected) => <RoleChip role={selected} />}
                      >
                        <MenuItem value="student">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <StudentIcon fontSize="small" />
                            <span>Student</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="admin">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <AdminIcon fontSize="small" />
                            <span>Admin</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminUsers;
