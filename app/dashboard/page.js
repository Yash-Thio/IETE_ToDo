"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Flag,
  FlagIcon,
  CheckCircle,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import {
  fetchUserTodoLists,
  addTodoList,
} from "@/lib/firebase-client-services";
import {
  fetchUserTodoListTasks,
  addTask,
  markTaskCompleted,
  fetchFlaggedTasks,
  fetchCompletedTasks,
  fetchTasksDueToday,
  fetchScheduledTasks,
} from "@/lib/todoServices";

const Dashboard = () => {
  const router = useRouter();
  const [lists, setLists] = useState([]);

  const [selectedList, setSelectedList] = useState(null);
  const [task, setTask] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    flagged: false,
  });

  
  const [today, setToday] = useState(0);
  const [scheduled, setScheduled] = useState(0);
  const [all, setAll] = useState(0);
  const [flagged, setFlagged] = useState(0);
  const [completed, setCompleted] = useState(0);

  // Add a state variable to track first load
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Add state to track the current category view
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");

  // Simplified updateTaskCounts function - focus on direct state updates
  const updateTaskCounts = async () => {
    console.log("update count function called");
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found for task counts");
        return;
      }

      console.log("Updating task counts with userId:", userId);

      // Use await for each call to ensure proper error handling
      const todayTasks = await fetchTasksDueToday(userId);
      setToday(todayTasks.length);
      console.log("Today tasks:", todayTasks.length);

      const scheduledTasks = await fetchScheduledTasks(userId);
      setScheduled(scheduledTasks.length);
      console.log("Scheduled tasks:", scheduledTasks.length);

      const flaggedTasks = await fetchFlaggedTasks(userId);
      setFlagged(flaggedTasks.length);
      console.log("Flagged tasks:", flaggedTasks.length);

      const completedTasks = await fetchCompletedTasks(userId);
      setCompleted(completedTasks.length);
      console.log("Completed tasks:", completedTasks.length);

      // For all tasks, get the count directly instead of fetching all data
      // let allTasksCount = 0;
      // if (lists.length > 0) {
      //   for (const list of lists) {
      //     const listTasks = await fetchUserTodoListTasks(userId, list.id);
      //     allTasksCount += listTasks.length;
      //   }
      // }
      // console.log("All tasks count:", allTasksCount);

      console.log("Task counts updated successfully");
    } catch (error) {
      console.error("Error updating task counts:", error);
    }
  };

  // Replace the old useEffect with a simpler initialization
  useEffect(() => {
    const initialize = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }

        console.log("Initializing dashboard with userId:", userId);

        // Fetch lists
        const todoLists = await fetchUserTodoLists(userId);
        console.log("Fetched lists:", todoLists);
        setLists(todoLists);

        // Wait a moment before updating counts to ensure lists are set in state
        setTimeout(() => {
          updateTaskCounts();
          setIsFirstLoad(false);
        }, 500);
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      }
    };

    initialize();
  }, []);

  // Add a simple effect to update counts when tasks or lists change
  useEffect(() => {
    if (!isFirstLoad) {
      console.log("Updating counts due to task or list change");
      updateTaskCounts();
    }
  }, [task, lists, isFirstLoad]);

  async function createListHandler(listName) {
    const userId = localStorage.getItem("userId");
    if (!listName.trim()) return;

    try {
      await addTodoList(userId, listName);
      const todoLists = await fetchUserTodoLists(userId);
      setLists(todoLists);
      closeListModal();

      // After creating a list, update task counts
      await updateTaskCounts();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  }

  // Add console logs to createTaskHandler and handleTaskCompletion
  async function createTaskHandler() {
    if (!selectedList || !newTask.title.trim()) return;

    try {
      const userId = localStorage.getItem("userId");
      console.log("Creating new task for list:", selectedList.id);

      await addTask(
        userId,
        selectedList.id,
        newTask.title,
        newTask.description,
        newTask.dueDate,
        newTask.flagged
      );

      // Refresh tasks for the selected list
      const updatedTasks = await fetchUserTodoListTasks(
        userId,
        selectedList.id
      );
      setTask(updatedTasks);
      console.log("Tasks updated after creation:", updatedTasks.length);

      // Close modal and reset form
      closeTaskModal();

      // Manually trigger a count update
      console.log("Manually updating counts after task creation");
      updateTaskCounts();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  async function handleListClick(list) {
    try {
      const userId = localStorage.getItem("userId");
      console.log("Fetching tasks for list:", list.id);

      // Set the selected list first
      setSelectedList(list);

      // Then fetch tasks for this list
      const tasks = await fetchUserTodoListTasks(userId, list.id);
      console.log("Tasks fetched:", tasks);
      setTask(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTask([]); // Set to empty array on error
    }
  }

  // Modify your task completion handler to ensure counts are updated
  async function handleTaskCompletion(taskId) {
    try {
      const userId = localStorage.getItem("userId");
      console.log("Marking task as complete:", taskId);

      await markTaskCompleted(taskId, true);
      console.log("Task marked complete successfully");

      
      const updatedTasks = await fetchUserTodoListTasks(
        userId,
        selectedList.id
      );
      setTask(updatedTasks);

      
      await updateTaskCounts();
    } catch (error) {
      console.error("Error marking task as complete:", error);
    }
  }

  
  async function handleCategoryClick(category) {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found");
        return;
      }

      setSelectedList(null); 
      setCurrentCategory(category);

      let tasks = [];

      switch (category) {
        case "today":
          tasks = await fetchTasksDueToday(userId);
          setCategoryTitle("Today's Tasks");
          break;
        case "scheduled":
          tasks = await fetchScheduledTasks(userId);
          setCategoryTitle("Scheduled Tasks");
          break;
        case "all":
          // Fetch all incomplete tasks from all lists
          const allLists = await fetchUserTodoLists(userId);
          const allTaskPromises = allLists.map((list) =>
            fetchUserTodoListTasks(userId, list.id)
          );
          const allTasksNested = await Promise.all(allTaskPromises);
          tasks = allTasksNested.flat(); // Flatten nested array
          setCategoryTitle("All Tasks");
          break;
        case "flagged":
          tasks = await fetchFlaggedTasks(userId);
          setCategoryTitle("Flagged Tasks");
          break;
        case "completed":
          tasks = await fetchCompletedTasks(userId);
          setCategoryTitle("Completed Tasks");
          break;
        default:
          console.error("Unknown category:", category);
          return;
      }

      console.log(`Fetched ${tasks.length} tasks for category: ${category}`);
      setTask(tasks);
    } catch (error) {
      console.error(`Error fetching ${category} tasks:`, error);
      setTask([]);
    }
  }

  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => {
    setIsListModalOpen(false);
    setNewListName("");
  };

  const openTaskModal = () => setIsModalOpen(true);
  const closeTaskModal = () => {
    setIsModalOpen(false);
    setNewTask({ title: "", description: "", dueDate: "", flagged: false });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              name: "Today",
              // count: today,
              icon: <Calendar className="w-5 h-5 text-white" />,
              bgColor: "bg-blue-500",
              category: "today",
            },
            {
              name: "Scheduled",
              // count: scheduled,
              icon: <Calendar className="w-5 h-5 text-white" />,
              bgColor: "bg-red-500",
              category: "scheduled",
            },
            {
              name: "All",
              // count: 0,
              icon: <Calendar className="w-5 h-5 text-white" />,
              bgColor: "bg-gray-500",
              category: "all",
            },
            {
              name: "Flagged",
              // count: flagged,
              icon: <Flag className="w-5 h-5 text-white" />,
              bgColor: "bg-yellow-500",
              category: "flagged",
            },
            {
              name: "Completed",
              // count: completed,
              icon: <CheckCircle className="w-5 h-5 text-white" />,
              bgColor: "bg-green-500",
              category: "completed",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center h-24 w-full cursor-pointer hover:bg-neutral-700 transition-colors"
              onClick={() => handleCategoryClick(item.category)}
            >
              <div className="flex flex-col items-start">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bgColor}`}
                >
                  {item.icon}
                </div>
                <p className="mt-2 text-gray-400 text-sm">{item.name}</p>
              </div>
              {/* <p className="text-white font-bold text-2xl">{item.count}</p> */}
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-gray-400 text-md font-semibold mb-3">My Lists</h2>
          <div className="space-y-3">
            {lists.map((list, index) => (
              <div
                key={index}
                className="bg-neutral-800 p-3 rounded-lg flex items-center justify-between cursor-pointer"
                onClick={() => handleListClick(list)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${list.bgColor}`}
                  >
                    <Calendar className="text-white w-5 h-5" />
                  </div>
                  <p className="text-white font-bold text-sm">
                    {list.listName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 text-sm">{list.count}</p>
                  <ChevronRight className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 flex items-center gap-2 text-blue-500"
            onClick={openListModal}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Add List
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="hidden lg:block w-2/3 bg-neutral-900 p-6 rounded-lg relative">
        {selectedList ? (
          <div>
            <h2 className="text-yellow-500 text-2xl font-bold">
              {selectedList.listName}
            </h2>
            <ul className="mt-4 space-y-4">
              {task && task.length > 0 ? (
                task.map((t, index) => (
                  <li
                    key={index}
                    data-id={t.id}
                    className="p-4 bg-neutral-800 rounded-lg flex items-start gap-3 hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        id={`task-${t.id}`}
                        name="task-selection"
                        className="appearance-none w-5 h-5 border-2 border-yellow-500 rounded-full 
                                  checked:bg-yellow-500 checked:border-yellow-500 cursor-pointer"
                        onChange={() => handleTaskCompletion(t.id)}
                        checked={t.completed || false}
                      />
                      <CheckCircle
                        className="absolute top-0 left-0 w-5 h-5 text-black pointer-events-none"
                        style={{
                          opacity: t.completed ? 1 : 0,
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{t.title}</h3>
                      <p className="text-gray-400 text-sm">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 text-sm">
                          {t.dueDate
                            ? new Date(
                                t.dueDate.seconds * 1000
                              ).toLocaleDateString()
                            : "No due date"}
                        </p>
                        {t.flagged && (
                          <Flag className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">
                  No tasks in this list. Add your first task!
                </p>
              )}
            </ul>
            <div className="absolute bottom-6 left-6">
              <div
                className="flex items-center gap-2 text-yellow-500 cursor-pointer"
                onClick={openTaskModal}
              >
                <div className="bg-yellow-500 text-black p-3 rounded-full">
                  <Plus className="w-4 h-4" />
                </div>
                <h1>Add Task</h1>
              </div>
            </div>
          </div>
        ) : currentCategory ? (
          <div>
            <h2 className="text-yellow-500 text-2xl font-bold">
              {categoryTitle}
            </h2>
            <ul className="mt-4 space-y-4">
              {task && task.length > 0 ? (
                task.map((t, index) => (
                  <li
                    key={index}
                    data-id={t.id}
                    className="p-4 bg-neutral-800 rounded-lg flex items-start gap-3 hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        id={`task-${t.id}`}
                        name="task-selection"
                        className="appearance-none w-5 h-5 border-2 border-yellow-500 rounded-full 
                                  checked:bg-yellow-500 checked:border-yellow-500 cursor-pointer"
                        onChange={() => handleTaskCompletion(t.id)}
                        checked={t.completed || false}
                        disabled={currentCategory === "completed"}
                      />
                      <CheckCircle
                        className="absolute top-0 left-0 w-5 h-5 text-black pointer-events-none"
                        style={{
                          opacity: t.completed ? 1 : 0,
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-white font-semibold">{t.title}</h3>
                        {/* Show list name for tasks in category views */}
                        <span className="text-xs text-gray-500 bg-neutral-700 px-2 py-1 rounded">
                          {lists.find((list) => list.id === t.listId)
                            ?.listName || "Unknown List"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 text-sm">
                          {t.dueDate
                            ? new Date(
                                t.dueDate.seconds * 1000
                              ).toLocaleDateString()
                            : "No due date"}
                        </p>
                        {t.flagged && (
                          <Flag className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">
                  No tasks found in this category.
                </p>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            Select a list or category to view tasks
          </p>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={closeTaskModal}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-white text-xl font-bold mb-4">Add Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <textarea
              placeholder="Task Description"
              className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <div className="flex items-center mb-3">
              <span className="text-yellow-500 mr-1">
                <FlagIcon className="w-5 h-5" />
              </span>

              <label htmlFor="flagCheckbox" className="text-white font-medium">
                Flag Task
              </label>
              <input
                type="checkbox"
                id="flagCheckbox"
                className="w-4 h-4 mr-2 ml-7"
                checked={newTask.flagged}
                onChange={(e) =>
                  setNewTask({ ...newTask, flagged: e.target.checked })
                }
              />
            </div>

            <div className="mb-3">
              <label className="text-white font-medium block mb-1">
                Task Deadline
              </label>
              <div className="flex items-center">
                <input
                  type="date"
                  className="w-full p-2 bg-neutral-800 text-white rounded-lg border border-gray-600"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              className="w-full p-2 bg-yellow-500 text-white rounded-lg font-bold"
              onClick={createTaskHandler}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* List Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={closeListModal}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-white text-xl font-bold mb-4">
              Create New List
            </h2>

            <input
              type="text"
              placeholder="List Name"
              className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />

            <button
              className="w-full p-2 bg-blue-500 text-white rounded-lg font-bold"
              onClick={() => createListHandler(newListName)}
            >
              Create List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
