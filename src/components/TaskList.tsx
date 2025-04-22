import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import { Task } from "../types";
import { Box, Button, List, Typography, Paper, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos").then((response) => {
      setTasks(response.data.slice(0, 10));
    });
  }, []);

  const deleteTask = (id: number) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Task List</Typography>
        <Button
          component={RouterLink}
          to="/edit/new"
          variant="contained"
          color="primary"
        >
          Add New Task
        </Button>
      </Stack>

      <List>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            isLast={task.id === tasks[tasks.length - 1].id}
          />
        ))}
      </List>
    </Paper>
  );
}

export default TaskList;
