# Software Requirements Specification (SRS)

## E-Learning Platform

---

## 1. Introduction

### 1.1 Purpose

This document defines the Software Requirements Specification (SRS) for the E-Learning Platform.  
It describes all functional and non-functional requirements to ensure a clear understanding between frontend, backend, and stakeholders.

### 1.2 Scope

The E-Learning Platform is a web-based system that allows students to register, enroll in courses, watch video lectures, track learning progress, and access educational resources.  
Admins manage courses, blogs, resources, and users through a centralized dashboard.

The platform is built using:

- React
- Material UI
- Firebase Authentication
- Firestore Database
- YouTube API
- Cloudinary (Image Upload)

---

## 2. User Roles

### 2.1 Student

- Register and log in
- Complete and edit profile
- Enroll in courses
- Watch video lectures
- Track progress
- Save videos to Watch Later
- Read blogs and resources
- No access to dashboard

### 2.2 Admin

- Access dashboard
- Add, edit, and delete:
  - Courses
  - Blogs
  - Resources
- View users data
- Cannot change user roles

### 2.3 Super Admin

- Full dashboard access
- All Admin permissions
- Manage user roles (Student / Admin)

---

## 3. Functional Requirements

---

## 3.1 Authentication

### 3.1.1 Sign Up

The registration form includes:

- First Name
- Last Name
- Email
- Password
- Confirm Password

After successful registration, the user is redirected to the Complete Profile page.

### 3.1.2 Sign In

- Email
- Password

### 3.1.3 Forgot Password

- Password reset via email using Firebase Authentication

---

## 3.2 Complete Profile

After first login, the student must complete their profile:

- Upload profile image (Cloudinary)
- Phone number
- Educational level selection

### 3.2.1 Dynamic Topics Selection

If **Level 1** is selected, an additional field appears:

- Topics:
  - HTML
  - CSS
  - JavaScript
  - GitHub

After saving, the user is redirected to My Courses.

---

## 3.3 My Courses

- Displays all enrolled courses
- Filters:
  - All courses
  - In-progress courses
  - Completed courses
- Each course has a Start button

---

## 3.4 Course Learning Page

- Embedded YouTube playlist videos
- Watch videos without leaving the platform
- Mark videos as completed
- Save videos to Watch Later

---

## 3.5 Watch Later

- Displays saved videos
- Accessible from user profile

---

## 3.6 Home Page

Includes:

- Website description
- CTA buttons:
  - View Courses
  - Sign Up / Sign In
- Courses section
- Blogs section
- Resources section
- Contact Us form
- Footer

---

## 3.7 Blogs

### 3.7.1 Blog List

- Displays all blogs added by Admin

### 3.7.2 Blog Details

- Full blog content
- Accessible via Read More

---

## 3.8 Resources

- Resource types:
  - PDF
  - Video
  - External link
- Filter by resource type
- View all resources page

---

## 3.9 User Profile

Displays:

- User information
- Profile image
- Enrolled courses
- Completed videos

### 3.9.1 Edit Profile

- Same structure as Complete Profile
- User can update or delete data

---

## 4. Dashboard (Admin & Super Admin)

---

## 4.1 Dashboard Overview

- Welcome message
- Statistics:
  - Total users
  - Total courses
  - Total blogs

---

## 4.2 Users Management

- Users table includes:
  - Name
  - Email
  - Phone
  - Level
  - Role
- Filters available

### Super Admin Only

- Change user roles

---

## 4.3 Courses Management

- Add course
- Edit course
- Delete course
- Assign level to course

---

## 4.4 Blogs Management

- Add blog
- Edit blog
- Delete blog

---

## 4.5 Resources Management

- Add resource
- Edit resource
- Delete resource

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Fast loading pages
- Optimized video streaming

### 5.2 Security

- Firebase Authentication
- Role-based access control
- Secure Firestore rules

### 5.3 Usability

- Responsive UI
- Clean and user-friendly interface

### 5.4 Scalability

- Modular React architecture
- Scalable Firestore structure

---

## 6. External Integrations

- Firebase Authentication
- Firestore Database
- YouTube API
- Cloudinary Image Upload

---

## 7. Assumptions & Constraints

- Internet connection required
- Valid email required for registration
- YouTube API limitations may apply

---

## 8. Future Enhancements

- Certificates
- Notifications
- Advanced analytics
- Offline support

---

## 9. Conclusion

This document defines all system requirements for the E-Learning Platform and serves as a reference for development and maintenance.
