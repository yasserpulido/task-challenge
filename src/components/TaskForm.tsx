import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
} from "@mui/material";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const method = id === "new" ? axios.post : axios.put;
    const url =
      id === "new"
        ? "https://jsonplaceholder.typicode.com/todos"
        : `https://jsonplaceholder.typicode.com/todos/${id}`;

    method(url, task).then(() => history.push("/"));
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="text"
            onClick={() => history.push("/")}
            sx={{ textTransform: "uppercase", fontWeight: 500 }}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          {id === "new" ? "Add New Task" : "Edit Task"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={task.title}
              fullWidth
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <TextField
              label="Description"
              value={task.description}
              fullWidth
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
            />
            <Button variant="contained" color="primary" type="submit">
              {id === "new" ? "Add Task" : "Update Task"}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default TaskForm;
