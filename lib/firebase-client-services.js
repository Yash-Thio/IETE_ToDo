import { db } from "@/lib/firebase-client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// User Management for client-side
export async function addOrUpdateUser(userId, userData) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // User doesn't exist, create new user
      await setDoc(userRef, {
        email: userData.email,
        name: userData.name,
        profileImage: userData.image || null,
        createdAt: serverTimestamp(),
      });
      console.log("New user added:", userId);
    } else {
      // User exists, update data if needed
      await setDoc(
        userRef,
        {
          name: userData.name,
          email: userData.email,
          profileImage: userData.image || userDoc.data().profileImage,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
      console.log("User updated:", userId);
    }
    return userId;
  } catch (error) {
    console.error("Error adding/updating user:", error);
    throw error;
  }
}

// Get user ID from email (used with NextAuth)
export function getUserIdFromEmail(email) {
  if (!email) return null;
  // Create a deterministic ID from email that's safe for Firebase document IDs
  return btoa(email).replace(/[+/=]/g, "");
}

// Check if a user exists in Firestore
export async function checkUserExists(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}

// Export other client-side Firebase functions as needed
export async function fetchUserTodoLists(userId) {
  try {
    const listsRef = collection(db, "todoLists");
    const q = query(listsRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return lists;
  } catch (error) {
    console.error("Error fetching user lists:", error);
    throw error;
  }
}

// Add a new list
export async function addTodoList(userId, listName) {
  try {
    const listRef = collection(db, "todoLists");
    const newList = await addDoc(listRef, {
      userId,
      listName,
      createdAt: serverTimestamp(),
    });
    console.log("New list added:", newList.id);
    return newList.id;
  } catch (error) {
    console.error("Error adding list:", error);
    throw error;
  }
}

// Add a task to a list
export async function addTask(
  userId,
  listId,
  title,
  description = "",
  dueDate = null
) {
  try {
    const taskRef = collection(db, "tasks");
    const dueDateTimestamp = dueDate
      ? Timestamp.fromDate(new Date(dueDate))
      : null;

    const newTask = await addDoc(taskRef, {
      userId,
      listId,
      title,
      description,
      dueDate: dueDateTimestamp,
      completed: false,
      flagged: false,
      createdAt: serverTimestamp(),
    });
    console.log("New task added:", newTask.id);
    return newTask.id;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}
