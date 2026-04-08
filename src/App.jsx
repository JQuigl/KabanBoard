import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const initialData = {
  toDo: [],
  inProgress: [],
  inReview: [],
  done: []
};

const columnColors = {
  todo: "bg-orange-100",
  inProgress: "bg-blue-100",
  inReview: "bg-purple-100",
  done: "bg-green-100 border-green-300",
};

const priorityBorder = {
  low: "border-green-400",
  medium: "border-yellow-400",
  high: "border-red-400",
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });
  const [draggedTask, setDraggedTask] = useState(null);

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };
  
  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task = { 
      id: Date.now(), 
      ...newTask,
    };

    setColumns((prev) => ({ 
      ...prev, 
      todo: [...(prev.todo || []), task],
    }));

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    });
  };

  const onDragStart = (task, fromColumn) => {
    setDraggedTask({ ...task, fromColumn });
  };

  const onDrop = (toColumn) => {
    if (!draggedTask) return;

    const updatedFrom = columns[draggedTask.fromColumn].filter(
      (t) => t.id !== draggedTask.id
    );
    const updatedTo = [...columns[toColumn], draggedTask];

    setColumns({
      ...columns,
      [draggedTask.fromColumn]: updatedFrom,
      [toColumn]: updatedTo
    });

    setDraggedTask(null);
  };

  const renderColumn = (title, key) => (
  <div
    className="flex-1 bg-gray-100 rounded-2xl p-4 min-h-[400px]"
    onDragOver={(e) => e.preventDefault()}
    onDrop={() => onDrop(key)}
  >
    <h2 className="text-xl font-semibold mb-4">{title}</h2>

    <div className="space-y-3">
      {(columns[key] || []).map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => onDragStart(task, key)}
          className={`rounded-xl shadow p-3 cursor-grab border hover:scale-[1.2] transition border ${
  priorityBorder[task.priority]} ${
    columnColors[key]}`}
        >
          <div className="font-semibold text-sm">
            {task.title}
          </div>

          {task.description && (
            <div className="text-xs text-gray-600 mt-1">
              {task.description}
            </div>
          )}

          <div className="flex justify-between text-xs mt-2">
            <span>
              {task.priority === "high" && "High"}
              {task.priority === "medium" && "Medium"}
              {task.priority === "low" && "Low"}
            </span>

            {task.dueDate && (
              <span className="text-gray-500">
                📅 {task.dueDate}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Task Board</h1>
      
      <div className="grid gap-2 mb-6">
        <input
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Task title"
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            onClick={addTask}
            className="bg-black text-white px-4 rounded"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {renderColumn("To Do", "todo")}
        {renderColumn("In Progress", "inProgress")}
        {renderColumn("In Review", "inReview")}
        {renderColumn("Done", "done")}
      </div>
    </div>
  );
}
