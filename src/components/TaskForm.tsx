import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState({ title: "", description: "" });
  const history = useHistory();

  useEffect(() => {
    if (id !== "new") {
      axios
        .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then((response) => {
          setTask({
            title: response.data.title,
            description: response.data.title,
          });
        });
    }
  }, [id]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (id === "new") {
      axios
        .post("https://jsonplaceholder.typicode.com/todos", task)
        .then(() => {
          history.push("/");
        });
    } else {
      axios
        .put(`https://jsonplaceholder.typicode.com/todos/${id}`, task)
        .then(() => {
          history.push("/");
        });
    }
  };

  return (
    <div>
      <h1>{id === "new" ? "Add New Task" : "Edit Task"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
        </div>
        <button type="submit">
          {id === "new" ? "Add Task" : "Update Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
