const { db } = require("./firebase");
const {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} = require("firebase/firestore");

// User Management
async function addOrUpdateUser(userId, userData) {
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
      await updateDoc(userRef, {
        name: userData.name,
        email: userData.email,
        profileImage: userData.image || userDoc.data().profileImage,
        lastLogin: serverTimestamp(),
      });
      console.log("User updated:", userId);
    }
    return userId;
  } catch (error) {
    console.error("Error adding/updating user:", error);
    throw error;
  }
}

// TodoList Management
async function addTodoList(userId, listName) {
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

async function fetchUserTodoLists(userId) {
  try {
    const listsRef = collection(db, "todoLists");
    const q = query(listsRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Lists data:", lists);
    return lists;
  } catch (error) {
    console.error("Error fetching user lists:", error);
    throw error;
  }
}

// Task Management
async function addTask(
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

async function updateTask(taskId, updateData) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    console.log("Task updated:", taskId);
    return taskId;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

async function markTaskCompleted(taskId, completed) {
  return updateTask(taskId, { completed });
}

async function toggleTaskFlag(taskId, flagged) {
  return updateTask(taskId, { flagged });
}

async function fetchUserTodoListTasks(userId, listId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("listId", "==", listId)
    );

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Tasks data for list:", listId, tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching list tasks:", error);
    throw error;
  }
}

async function fetchFlaggedTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("flagged", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Flagged tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching flagged tasks:", error);
    throw error;
  }
}

async function fetchCompletedTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("completed", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Completed tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    throw error;
  }
}

async function fetchTasksDueToday(userId) {
  try {
    // Get today's date at beginning and end
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTimestamp = Timestamp.fromDate(today);
    const tomorrowTimestamp = Timestamp.fromDate(tomorrow);

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("dueDate", ">=", todayTimestamp),
      where("dueDate", "<", tomorrowTimestamp)
    );

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Tasks due today:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks due today:", error);
    throw error;
  }
}

async function fetchScheduledTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    // Get tasks with due date and incomplete
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("completed", "==", false)
    );

    const querySnapshot = await getDocs(q);

    // Filter to only include tasks that have a dueDate field (non-null)
    const tasks = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((task) => task.dueDate);

    console.log("Scheduled tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching scheduled tasks:", error);
    throw error;
  }
}

async function fetchUnscheduledTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("completed", "==", false)
    );

    const querySnapshot = await getDocs(q);

    // Filter to only include tasks with no dueDate
    const tasks = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((task) => !task.dueDate);

    console.log("Unscheduled tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching unscheduled tasks:", error);
    throw error;
  }
}

module.exports = {
  addOrUpdateUser,
  addTodoList,
  addTask,
  updateTask,
  markTaskCompleted,
  toggleTaskFlag,
  fetchUserTodoLists,
  fetchUserTodoListTasks,
  fetchFlaggedTasks,
  fetchCompletedTasks,
  fetchTasksDueToday,
  fetchScheduledTasks,
  fetchUnscheduledTasks
};