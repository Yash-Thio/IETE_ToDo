"use client";

import { useState } from "react";
import { db } from "@/lib/firebase-client";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Client-side implementation of addOrUpdateUser
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

// Function to create a new list
async function createList(userId, listName) {
  try {
    const listRef = collection(db, "todoLists");
    const newList = await addDoc(listRef, {
      userId,
      listName,
      createdAt: serverTimestamp(),
    });
    console.log("New list created:", newList.id);
    return { id: newList.id, listName, userId };
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}

// Function to create a new task
async function createTask(userId, listId, taskData) {
  try {
    const taskRef = collection(db, "tasks");
    const dueDateTimestamp = taskData.dueDate
      ? Timestamp.fromDate(new Date(taskData.dueDate))
      : null;

    const newTask = await addDoc(taskRef, {
      userId,
      listId,
      title: taskData.title,
      description: taskData.description || "",
      dueDate: dueDateTimestamp,
      completed: false,
      flagged: false,
      createdAt: serverTimestamp(),
    });

    console.log("New task created:", newTask.id);
    return { id: newTask.id, ...taskData, listId };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

// Function to fetch all lists
async function fetchLists(userId) {
  try {
    const listsRef = collection(db, "todoLists");
    const q = query(listsRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched lists:", lists);
    return lists;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
}

// Function to fetch tasks for a specific list
async function fetchTasks(userId, listId) {
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

    console.log("Fetched tasks for list", listId, ":", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export default function TestFirebasePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("EvleJdJmraLT08B2eiFx"); // Default test user ID
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [newListName, setNewListName] = useState("Test List");
  const [newTaskTitle, setNewTaskTitle] = useState("Test Task");
  const [newTaskDescription, setNewTaskDescription] = useState(
    "This is a test task"
  );

  // Create/update user
  const handleUserTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = {
        email: "example@email.com",
        name: "Lola Smith",
        image: "https://example.com/profile.jpg",
      };

      const result = await addOrUpdateUser(userId, userData);
      setResult(JSON.stringify(result, null, 2));
      console.log("Test result:", result);
    } catch (err) {
      console.error("Test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new list
  const handleCreateList = async () => {
    setLoading(true);
    setError(null);

    try {
      const newList = await createList(userId, newListName);
      setResult(JSON.stringify(newList, null, 2));
      setSelectedListId(newList.id);

      // Refresh lists
      const updatedLists = await fetchLists(userId);
      setLists(updatedLists);
    } catch (err) {
      console.error("Create list error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const handleCreateTask = async () => {
    if (!selectedListId) {
      setError("Please select a list first or create a new one");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = {
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
      };

      const newTask = await createTask(userId, selectedListId, taskData);
      setResult(JSON.stringify(newTask, null, 2));

      // Refresh tasks for the selected list
      const updatedTasks = await fetchTasks(userId, selectedListId);
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Create task error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all lists for the user
  const handleFetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedLists = await fetchLists(userId);
      setLists(fetchedLists);
      setResult(JSON.stringify(fetchedLists, null, 2));
    } catch (err) {
      console.error("Fetch lists error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for selected list
  const handleFetchTasks = async () => {
    if (!selectedListId) {
      setError("Please select a list first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedTasks = await fetchTasks(userId, selectedListId);
      setTasks(fetchedTasks);
      setResult(JSON.stringify(fetchedTasks, null, 2));
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Firebase Function Test</h1>

      {/* User ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* User Test Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleUserTest}
          disabled={loading}
          className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Test Add/Update User"}
        </button>
      </div>

      {/* Create List Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create List</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List Name"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleCreateList}
            disabled={loading || !newListName.trim()}
            className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
          >
            Create List
          </button>
        </div>
      </div>

      {/* Fetch Lists Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Lists</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleFetchLists}
            disabled={loading}
            className="p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-purple-300"
          >
            Fetch Lists
          </button>
        </div>

        {/* Display Lists */}
        {lists.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select a List:
            </label>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a list...</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.listName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Create Task Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>
        <div className="space-y-4 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="w-full p-2 border rounded h-24"
          />
          <button
            onClick={handleCreateTask}
            disabled={loading || !selectedListId || !newTaskTitle.trim()}
            className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Fetch Tasks Section */}
      <div className="border-t border-gray-200 pt-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">List Tasks</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleFetchTasks}
            disabled={loading || !selectedListId}
            className="p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-purple-300"
          >
            Fetch Tasks
          </button>
        </div>

        {/* Display Tasks */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Tasks in Selected List:</h3>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="p-3 bg-gray-50 rounded border">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-600">
                    {task.description}
                  </div>
                  {task.dueDate && (
                    <div className="text-xs text-gray-500">
                      Due: {task.dueDate.toDate().toLocaleDateString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Results Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
          <p className="font-bold">Result:</p>
          <pre className="mt-2 bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-64">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
