import React, { createContext, useEffect, useState } from "react";
import { coursesArr } from "../courses";

export const CoursesContext = createContext();
const LOCAL_STORAGE_KEY = "course-progress-data";

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(coursesArr);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCourses(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const markLectureComplete = (lectureId, courseId) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          lectures: course.lectures.map((lec) =>
            lec.id === lectureId ? { ...lec, isCompleted: true } : lec
          ),
        };
      }
      return course;
    });

    setCourses(updatedCourses);
  };

  const markLectureUnwatched = (courseId, lectureId) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            lectures: course.lectures.map((lec) =>
              lec.id === lectureId ? { ...lec, isCompleted: false } : lec
            ),
          }
        : course
    );
    setCourses(updatedCourses);
  };

  const getCompletedCount = () => {
    return courses.reduce(
      (total, course) =>
        total + course.lectures.filter((lec) => lec.isCompleted).length,
      0
    );
  };

  const addCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        markLectureComplete,
        markLectureUnwatched,
        getCompletedCount,
        addCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
