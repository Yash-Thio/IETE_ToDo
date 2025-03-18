"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Flag,FlagIcon, CheckCircle, ChevronRight, Plus, X } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();
  const [lists, setLists] = useState([
    {
      name: "Reminders",
      count: 2,
      bgColor: "bg-purple-500",
      tasks: [
        { title: "Meeting", description: "Team sync-up at 10 AM", dueDate: "Today" },
        { title: "Groceries", description: "Buy vegetables and milk", dueDate: "Tomorrow" },
      ],
    },
    {
      name: "Urgent To-Do",
      count: 2,
      bgColor: "bg-orange-500",
      tasks: [
        { title: "Project Report", description: "Submit the final project report", dueDate: "Today" },
        { title: "Bank Call", description: "Call the bank for loan inquiry", dueDate: "Tomorrow" },
      ],
    },
  ]);

  const [selectedList, setSelectedList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", flagged: false });

  const addNewList = () => {
    if (!newListName.trim()) return;
    const newList = { name: newListName, count: 0, bgColor: "bg-blue-500", tasks: [] };
    setLists((prevLists) => [...prevLists, newList]);
    closeListModal();
  };

  const addTaskToList = () => {
    if (!newTask.title.trim() || !selectedList) return;
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.name === selectedList.name
          ? { ...list, tasks: [...list.tasks, newTask], count: list.count + 1 }
          : list
      )
    );
    setSelectedList((prev) =>
      prev ? { ...prev, tasks: [...prev.tasks, newTask], count: prev.count + 1 } : null
    );
    closeTaskModal();
  };

  const handleListClick = (list) => {
    if (window.innerWidth < 1024) {
      router.push(`/list/${list.name.toLowerCase().replace(/\s+/g, "-")}`);
    } else {
      setSelectedList(list);
    }
  };

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
            { name: "Today", count: 5, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-blue-500" },
            { name: "Scheduled", count: 8, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-red-500" },
            { name: "All", count: 15, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-gray-500" },
            { name: "Flagged", count: 3, icon: <Flag className="w-5 h-5 text-white" />, bgColor: "bg-yellow-500" },
            { name: "Completed", count: 20, icon: <CheckCircle className="w-5 h-5 text-white" />, bgColor: "bg-green-500" },
          ].map((item, index) => (
            <div key={index} className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center h-24 w-full">
              <div className="flex flex-col items-start">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bgColor}`}>
                  {item.icon}
                </div>
                <p className="mt-2 text-gray-400 text-sm">{item.name}</p>
              </div>
              <p className="text-white font-bold text-2xl">{item.count}</p>
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
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${list.bgColor}`}>
                    <Calendar className="text-white w-5 h-5" />
                  </div>
                  <p className="text-white font-bold text-sm">{list.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-gray-400 text-sm">{list.count}</p>
                  <ChevronRight className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-2 text-blue-500" onClick={openListModal}>
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
            <h2 className="text-yellow-500 text-2xl font-bold">{selectedList.name}</h2>
            <ul className="mt-4 space-y-4">
              {selectedList.tasks.map((task, index) => (
                <li key={index} className="p-4 bg-neutral-800 rounded-lg flex items-start gap-3">
                  <input
                    type="radio"
                    name="task-selection"
                    className="w-5 h-5 accent-yellow-500 mt-1"
                                     />
                  <div>
                    <h3 className="text-white font-semibold">{task.title}</h3>
                    <p className="text-gray-400 text-sm">{task.description}</p>
                    <p className="text-gray-400 text-sm">{task.dueDate}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div
              className="absolute bottom-6 left-6 flex items-center gap-2 text-yellow-500 font-semibold cursor-pointer"
              onClick={() => openTaskModal}
            >
              
               <div className="absolute bottom-6 left-6 flex items-center gap-2 text-yellow-500" onClick={openTaskModal}>
              <div className="bg-yellow-500 text-black p-3 rounded-full">
                <Plus className="w-4 h-4" />
              </div>
              <h1>Add Task</h1>
            </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">Select a list to view details</p>
        )}
      </div>


      {/* Task Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-lg w-96 shadow-lg relative">
      <button className="absolute top-2 right-2 text-white" onClick={closeTaskModal}>
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-white text-xl font-bold mb-4">Add Task</h2>
      
      <input 
        type="text" 
        placeholder="Task Title" 
        className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600" 
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      
      <textarea 
        placeholder="Task Description" 
        className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600" 
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      
      <div className="flex items-center mb-3">
        <span className="text-yellow-500 mr-1">
          <FlagIcon className="w-5 h-5" />
        </span>
        
        <label htmlFor="flagCheckbox" className="text-white font-medium">Flag Task</label>
        <input 
          type="checkbox" 
          id="flagCheckbox" 
          className="w-4 h-4 mr-2 ml-7" 
          checked={newTask.flagged || false}
          onChange={(e) => setNewTask({ ...newTask, flagged: e.target.checked })}
        />
      </div>
      
      <div className="mb-3">
        <label className="text-white font-medium block mb-1">Task Deadline</label>
        <div className="flex items-center">
          <input 
            type="date" 
            className="w-full p-2 bg-neutral-800 text-white rounded-lg border border-gray-600" 
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
        </div>
      </div>
      
      <button 
        className="w-full p-2 bg-yellow-500 text-white rounded-lg font-bold" 
        onClick={() => addTaskToList(selectedList.name, newTask)}>
        Add
      </button>
    </div>
  </div>
)}




      {/* List Modal */}
      {isListModalOpen && (
  <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-lg w-96 shadow-lg relative">
      <button className="absolute top-2 right-2 text-white" onClick={closeListModal}>
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-white text-xl font-bold mb-4">Create New List</h2>
      
      <input 
        type="text" 
        placeholder="List Name" 
        className="w-full p-2 mb-3 bg-neutral-800 text-white rounded-lg border border-gray-600" 
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      
      <button 
        className="w-full p-2 bg-blue-500 text-white rounded-lg font-bold"
        onClick={() => addNewList(newListName)}>
        Create List
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
