import React from "react";
import { Link } from "react-router-dom";
import { Task } from "./types";

type Props = {
  task: Task;
  deleteTask: (id: number) => void;
};

function TaskItem({ task, deleteTask }: Props) {
  return (
    <li>
      <span>{task.title}</span>
      <Link to={`/edit/${task.id}`}>Edit</Link>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
}

export default TaskItem;
