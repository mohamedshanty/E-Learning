import React, { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  writeBatch,
  getDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const CoursesContext = createContext();

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateCourseProgress = (lectures) => {
    if (!lectures || lectures.length === 0) return 0;
    const completed = lectures.filter((lec) => lec.isCompleted).length;
    return Math.round((completed / lectures.length) * 100);
  };

  const calculateCourseStatus = (lectures) => {
    if (!lectures || lectures.length === 0) return "not-started";
    const completedCount = lectures.filter((lec) => lec.isCompleted).length;
    if (completedCount === 0) return "not-started";
    if (completedCount === lectures.length) return "completed";
    return "in-progress";
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("uid");

      let userData = {};
      let userProgress = {};

      if (userId) {
        const [userDoc, progressDoc] = await Promise.all([
          getDoc(doc(db, "users", userId)),
          getDoc(doc(db, "userProgress", userId)),
        ]);

        if (userDoc.exists()) {
          userData = userDoc.data();
        }
        if (progressDoc.exists()) {
          userProgress = progressDoc.data();
        }
      }

      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = await Promise.all(
        querySnapshot.docs.map(async (courseDoc) => {
          const courseData = courseDoc.data();
          const courseId = courseDoc.id;

          const lecturesSnapshot = await getDocs(
            collection(db, "courses", courseId, "lectures")
          );
          let lectures = lecturesSnapshot.docs.map((lecDoc) => ({
            id: lecDoc.id,
            ...lecDoc.data(),
          }));

          if (courseData.lecturesOrder) {
            lectures.sort(
              (a, b) =>
                courseData.lecturesOrder.indexOf(a.id) -
                courseData.lecturesOrder.indexOf(b.id)
            );
          } else {
            lectures.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          }

          if (userProgress[courseId]) {
            lectures = lectures.map((lecture) => ({
              ...lecture,
              isCompleted:
                userProgress[courseId].completedLectures?.includes(
                  lecture.id
                ) || false,
            }));
          } else {
            lectures = lectures.map((lecture) => ({
              ...lecture,
              isCompleted: false,
            }));
          }

          return {
            id: courseId,
            ...courseData,
            lectures,
            progress: calculateCourseProgress(lectures),
            status: calculateCourseStatus(lectures),
            isEnrolled: userData.enrolledCourses?.includes(courseId) || false,
          };
        })
      );
      setCourses(coursesData);
    } catch (err) {
      setError(err);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLectureStatus = async (
    courseId,
    lectureId,
    isCompleted,
    callback
  ) => {
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) throw new Error("User not authenticated");

      const userProgressRef = doc(db, "userProgress", userId);
      const userProgressDoc = await getDoc(userProgressRef);

      let userProgress = {};
      if (userProgressDoc.exists()) {
        userProgress = userProgressDoc.data();
      }

      if (!userProgress[courseId]) {
        userProgress[courseId] = {
          completedLectures: [],
          lastAccessed: new Date().toISOString(),
        };
      }

      if (isCompleted) {
        if (!userProgress[courseId].completedLectures.includes(lectureId)) {
          userProgress[courseId].completedLectures.push(lectureId);
        }
      } else {
        userProgress[courseId].completedLectures = userProgress[
          courseId
        ].completedLectures.filter((id) => id !== lectureId);
      }

      await setDoc(userProgressRef, userProgress, { merge: true });

      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course.id === courseId) {
            const updatedLectures = course.lectures.map((lecture) => {
              if (lecture.id === lectureId) {
                return { ...lecture, isCompleted };
              }
              return lecture;
            });

            const progress = calculateCourseProgress(updatedLectures);
            const status = calculateCourseStatus(updatedLectures);

            if (callback) callback();

            return {
              ...course,
              lectures: updatedLectures,
              progress,
              status,
            };
          }
          return course;
        })
      );
    } catch (err) {
      console.error("Error updating lecture:", err);
      throw err;
    }
  };

  const markLectureComplete = (courseId, lectureId, callback) => {
    return updateLectureStatus(courseId, lectureId, true, callback);
  };

  const markLectureUnwatched = (courseId, lectureId, callback) => {
    return updateLectureStatus(courseId, lectureId, false, callback);
  };

  const addCourse = async (newCourse) => {
    try {
      const courseId = nanoid();
      const { lectures, ...courseInfo } = newCourse;

      const courseWithId = {
        ...courseInfo,
        id: courseId,
        createdAt: new Date().toISOString(),
        totalLectures: lectures.length,
        progress: 0,
        status: "not-started",
        lecturesOrder: lectures.map((v) => v.id),
      };

      await setDoc(doc(db, "courses", courseId), courseWithId);

      const batch = writeBatch(db);

      lectures.forEach((lecture) => {
        const lectureRef = doc(db, "courses", courseId, "lectures", lecture.id);
        batch.set(lectureRef, {
          ...lecture,
          order: lecture.order,
        });
      });

      await batch.commit();
      await fetchCourses();
      return courseId;
    } catch (err) {
      console.error("Error adding course:", err);
      throw err;
    }
  };

  const getCompletedCount = () => {
    return courses.reduce(
      (total, course) =>
        total + (course.lectures?.filter((lec) => lec.isCompleted).length || 0),
      0
    );
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider
      value={{
        courses,
        loading,
        error,
        markLectureComplete,
        markLectureUnwatched,
        getCompletedCount,
        addCourse,
        refreshCourses: fetchCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
