// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   Paper,
//   Box,
//   Avatar,
//   IconButton,
//   Divider,
//   MenuItem,
// } from "@mui/material";
// import { db, storage } from "../../config/firebase"; // تأكد من تصدير storage من ملف firebase
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { useNavigate } from "react-router-dom";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
// import assets from "../../assets/assets";

// const academicYears = [
//   "First Year",
//   "Second Year",
//   "Third Year",
//   "Fourth Year",
//   "Graduate",
// ];

// const EditProfile = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     year: "",
//     imageUrl: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const uid = localStorage.getItem("uid");
//       if (!uid) return;

//       try {
//         const [userDoc, profileDoc] = await Promise.all([
//           getDoc(doc(db, "users", uid)),
//           getDoc(doc(db, "profiles", uid)),
//         ]);

//         const profileData = profileDoc.exists() ? profileDoc.data() : {};
//         const userData = userDoc.exists() ? userDoc.data() : {};

//         setFormData({
//           fullName: profileData.fullName || userData.fullName || "",
//           phone: profileData.phone || "",
//           year: profileData.year || "",
//           imageUrl: profileData.imageUrl || userData.avatar || "",
//         });

//         setImagePreview(
//           profileData.imageUrl || userData.avatar || assets.avatar_icon
//         );
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         setError("Failed to load profile data");
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       setLoading(true);
//       setError("");

//       // اختر إما Firebase Storage أو Cloudinary
//       // الطريقة 1: استخدام Firebase Storage
//       const uid = localStorage.getItem("uid");
//       const storageRef = ref(storage, `profile_images/${uid}/${file.name}`);

//       // Upload image to Firebase Storage
//       const uploadTask = uploadBytes(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setUploadProgress(progress);
//         },
//         (error) => {
//           console.error("Upload error:", error);
//           setError("Failed to upload image");
//           setLoading(false);
//         },
//         async () => {
//           try {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             setFormData((prev) => ({ ...prev, imageUrl: downloadURL }));
//             setImagePreview(downloadURL);
//           } catch (error) {
//             console.error("Error getting download URL:", error);
//             setError("Failed to get image URL");
//           } finally {
//             setLoading(false);
//             setUploadProgress(0);
//           }
//         }
//       );

//       // الطريقة 2: استخدام Cloudinary (إذا واجهتك مشاكل مع Firebase Storage)
//       /*
//       const imageUrl = await uploadImageToCloudinary(file);
//       setFormData(prev => ({ ...prev, imageUrl }));
//       setImagePreview(imageUrl);
//       setLoading(false);
//       */
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setError("Failed to upload image");
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const uid = localStorage.getItem("uid");
//     if (!uid) return;

//     try {
//       setLoading(true);
//       setError("");

//       const profileRef = doc(db, "profiles", uid);
//       const updates = {
//         fullName: formData.fullName,
//         phone: formData.phone,
//         year: formData.year,
//         updatedAt: new Date().toISOString(),
//       };

//       // Only update imageUrl if it has changed
//       if (formData.imageUrl) {
//         updates.imageUrl = formData.imageUrl;
//       }

//       await updateDoc(profileRef, updates);

//       // Also update in users collection
//       const userUpdates = {
//         fullName: formData.fullName,
//       };

//       if (formData.imageUrl) {
//         userUpdates.avatar = formData.imageUrl;
//       }

//       await updateDoc(doc(db, "users", uid), userUpdates);

//       navigate("/profile", { state: { profileUpdated: true } });
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setError("Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ py: { xs: 4, md: 10 } }}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: { xs: 2, sm: 4 },
//           mx: "auto",
//           maxWidth: 600,
//           width: "100%",
//           background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
//           color: "#fff",
//         }}
//       >
//         <Typography variant="h5" mb={3} color="primary">
//           Edit Profile
//         </Typography>

//         {error && (
//           <Typography color="error" mb={2}>
//             {error}
//           </Typography>
//         )}

//         <Stack spacing={3}>
//           <Box display="flex" flexDirection="column" alignItems="center">
//             <Avatar
//               src={imagePreview}
//               sx={{
//                 width: 120,
//                 height: 120,
//                 border: "2px solid #00ADB5",
//                 mb: 2,
//               }}
//             />
//             <input
//               accept="image/*"
//               id="profile-image-upload"
//               type="file"
//               style={{ display: "none" }}
//               onChange={handleImageChange}
//               disabled={loading}
//             />
//             <label htmlFor="profile-image-upload">
//               <IconButton
//                 color="primary"
//                 component="span"
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "#00ADB5",
//                   "&:hover": { backgroundColor: "#008C9E" },
//                 }}
//               >
//                 <PhotoCamera sx={{ color: "#fff" }} />
//               </IconButton>
//             </label>
//             {uploadProgress > 0 && uploadProgress < 100 && (
//               <Typography variant="caption" color="textSecondary">
//                 Uploading: {Math.round(uploadProgress)}%
//               </Typography>
//             )}
//           </Box>

//           <Divider sx={{ borderColor: "#333" }} />

//           <TextField
//             label="Full Name"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             fullWidth
//             required
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "#00ADB5",
//               },
//               "& .MuiInputBase-input": {
//                 color: "#fff",
//               },
//             }}
//           />

//           <TextField
//             label="Phone Number"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             fullWidth
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "#00ADB5",
//               },
//               "& .MuiInputBase-input": {
//                 color: "#fff",
//               },
//             }}
//           />

//           <TextField
//             select
//             label="Academic Year"
//             name="year"
//             value={formData.year}
//             onChange={handleChange}
//             fullWidth
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#00ADB5",
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "#00ADB5",
//               },
//               "& .MuiInputBase-input": {
//                 color: "#fff",
//               },
//               "& .MuiSvgIcon-root": {
//                 color: "#00ADB5",
//               },
//             }}
//           >
//             {academicYears.map((year) => (
//               <MenuItem key={year} value={year} sx={{ color: "#000" }}>
//                 {year}
//               </MenuItem>
//             ))}
//           </TextField>

//           <Box textAlign="center" mt={2}>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               sx={{
//                 px: 5,
//                 backgroundColor: "#00ADB5",
//                 "&:hover": { backgroundColor: "#008C9E" },
//               }}
//             >
//               {loading ? "Saving..." : "Save Changes"}
//             </Button>
//           </Box>
//         </Stack>
//       </Paper>
//     </Container>
//   );
// };

// export default EditProfile;
