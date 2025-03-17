"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Flag, CheckCircle, ChevronRight, Plus } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();
  const [lists, setLists] = useState([
    {
      name: "Reminders",
      count: 10,
      bgColor: "bg-purple-500",
      tasks: [
        { title: "Meeting", description: "Team sync-up at 10 AM", dueDate: "Due: Today" },
        { title: "Groceries", description: "Buy vegetables and milk", dueDate: "Due: Tomorrow" },
      ],
    },
    {
      name: "Urgent To-Do",
      count: 4,
      bgColor: "bg-orange-500",
      tasks: [
        { title: "Project Report", description: "Submit the final project report", dueDate: "Due: Today" },
        { title: "Bank Call", description: "Call the bank for loan inquiry", dueDate: "Due: Tomorrow" },
      ],
    },
  ]);

  const [selectedList, setSelectedList] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const addNewList = () => {
    const newList = { name: `New List ${lists.length + 1}`, count: 0, bgColor: "bg-blue-500", tasks: [] };
    setLists([...lists, newList]);
  };

  const addTaskToList = (listName, task) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.name === listName
          ? { ...list, tasks: [...list.tasks, task], count: list.count + 1 }
          : list
      )
    );
  };

  const handleListClick = (list) => {
    if (window.innerWidth < 1024) {
      router.push(`/list/${list.name.toLowerCase().replace(/\s+/g, "-")}`);
    } else {
      setSelectedList(list);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col lg:flex-row gap-6 font-['SF Pro']">
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-hidden pb-16">
        <div className="grid grid-cols-2 gap-4">
          {[{ name: "Today", count: 5, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-blue-500" },
            { name: "Scheduled", count: 8, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-red-500" },
            { name: "All", count: 15, icon: <Calendar className="w-5 h-5 text-white" />, bgColor: "bg-gray-500" },
            { name: "Flagged", count: 3, icon: <Flag className="w-5 h-5 text-white" />, bgColor: "bg-yellow-500" },
            { name: "Completed", count: 20, icon: <CheckCircle className="w-5 h-5 text-white" />, bgColor: "bg-green-500" },
          ].map((item, index) => (
            <div key={index} className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center h-24 w-full">
              <div className="flex flex-col items-start">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bgColor}`}>{item.icon}</div>
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
          <button className="mt-4 flex items-center gap-2 text-blue-500 cursor-pointer" onClick={addNewList}>
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            Add List
          </button>
        </div>
      </div>

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
                    checked={selectedTask === index}
                    onChange={() => setSelectedTask(index)}
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
              onClick={() => addTaskToList(selectedList.name, { title: "New Task", description: "Task details", dueDate: "Due: TBD" })}
            >
              <div className="bg-yellow-500 text-black p-3 rounded-full shadow-lg">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-lg">Add {selectedList.name}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">Select a list to view details</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;