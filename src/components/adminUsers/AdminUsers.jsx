import React, { useEffect, useState, useContext } from "react";
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
  Collapse,
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
  Phone as PhoneIcon,
  CalendarToday as YearIcon,
  Subject as TopicsIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { currentUser } = useContext(AuthContext);
  const isSuperAdmin = currentUser?.isSuperAdmin;

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      // Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersData = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Fetch profiles
      const profilesSnap = await getDocs(collection(db, "profiles"));
      const profilesData = {};
      profilesSnap.forEach((doc) => {
        profilesData[doc.id] = doc.data();
      });
      setProfiles(profilesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
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

  const toggleRowExpand = (userId) => {
    setExpandedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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

  const ProfileInfoRow = ({ userId }) => {
    const profile = profiles[userId];

    if (!profile) {
      return (
        <TableRow>
          <TableCell
            colSpan={isMobile ? 3 : 5}
            sx={{ color: "#AAAAAA", fontStyle: "italic" }}
          >
            No profile information available
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow>
        <TableCell colSpan={isMobile ? 3 : 5} sx={{ padding: 0 }}>
          <Box sx={{ backgroundColor: "#0A0A0A", p: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ color: "#EEEEEE" }}>
                  Phone: {profile.phone || "Not provided"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <YearIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ color: "#EEEEEE" }}>
                  Year: {profile.year ? `Year ${profile.year}` : "Not provided"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <TopicsIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#EEEEEE", mb: 0.5 }}
                  >
                    Topics:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {profile.topics?.length > 0 ? (
                      profile.topics.map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          size="small"
                          sx={{
                            backgroundColor: "#393E4620",
                            color: "#EEEEEE",
                            border: "1px solid #00ADB5",
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ color: "#AAAAAA", fontStyle: "italic" }}
                      >
                        No topics selected
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    );
  };

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
            sx={{ fontWeight: 700, color: "#00ADB5", mb: 1 }}
          >
            Users Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#AAAAAA", fontWeight: 400 }}
          >
            View and manage all registered users and their profiles
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
                {isSuperAdmin && (
                  <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                    Role
                  </TableCell>
                )}
                <TableCell sx={{ color: "#00ADB5", fontWeight: 600 }}>
                  Profile
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{ color: "#EEEEEE", textAlign: "center", py: 4 }}
                  >
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <TableRow
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
                            <Typography
                              variant="body2"
                              sx={{ color: "#AAAAAA" }}
                            >
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
                      {isSuperAdmin && (
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
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#00ADB5",
                                },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#00ADB5",
                              },
                            }}
                            renderValue={(selected) => (
                              <RoleChip role={selected} />
                            )}
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
                      )}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpand(user.id)}
                          sx={{ color: "#00ADB5" }}
                        >
                          {expandedRows.includes(user.id) ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={isMobile ? 3 : 5}
                        sx={{ padding: 0, borderBottom: 0 }}
                      >
                        <Collapse in={expandedRows.includes(user.id)}>
                          <ProfileInfoRow userId={user.id} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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
