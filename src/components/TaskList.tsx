import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TaskItem from "./TaskItem";
import { Task } from "./types";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
      setTasks(response.data.slice(0, 10)); // Limitar a 10 tareas para la demostración
    });
  }, []);

  const deleteTask = (id: number) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      });
  };

  return (
    <div>
      <h1>Task List</h1>
      <Link to="/edit/new">Add New Task</Link>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
