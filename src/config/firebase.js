import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8CUlqhVBPYBv4AIH40fRf5HyEIuGYYjY",
  authDomain: "e-learning-9fecf.firebaseapp.com",
  projectId: "e-learning-9fecf",
  storageBucket: "e-learning-9fecf.appspot.com",
  messagingSenderId: "323101797845",
  appId: "1:323101797845:web:822a0bfd1a020c3704215c",
  measurementId: "G-2CND6G3H57",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (firstName, lastName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      fullName: `${firstName} ${lastName}`,
      email,
      avatar: "",
      role: "student",
      lastSeen: Date.now(),
      enrolledCourses: [],
      profileCompleted: false,
    });

    localStorage.setItem("uid", user.uid);
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.data();

    localStorage.setItem("uid", uid);
    localStorage.setItem("role", userData.role);
    localStorage.setItem(
      "profileCompleted",
      userData.profileCompleted ? "true" : "false"
    );

    return {
      uid,
      role: userData.role,
      profileCompleted: userData.profileCompleted || false,
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export { app, auth, db, signup, login, logout };
