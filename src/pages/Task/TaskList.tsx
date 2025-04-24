import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  List,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MuiAlert from "@mui/material/Alert";
import { TextField } from "@mui/material";

import { Task } from "../../types";
import TaskDetailModal from "./TaskDetailModal";
import TaskItem from "./TaskItem";
import { useUIStore } from "../../store/useUIStore";

export const fetchTasks = async (): Promise<Task[]> => {
  const local = localStorage.getItem("tasks");
  if (local) {
    return JSON.parse(local);
  }

  const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
  const data = res.data.slice(0, 10);
  localStorage.setItem("tasks", JSON.stringify(data));
  return data;
};

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TaskList() {
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const showCompleted = useUIStore((state) => state.showCompleted);
  const toggleShowCompleted = useUIStore((state) => state.toggleShowCompleted);
  const searchTerm = useUIStore((state) => state.searchTerm);
  const setSearchTerm = useUIStore((state) => state.setSearchTerm);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => {
      const current = JSON.parse(localStorage.getItem("tasks") || "[]");
      const updated = current.filter((task: Task) => task.id !== id);
      localStorage.setItem("tasks", JSON.stringify(updated));
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpenSnackbar(true);
    },
  });

  const deleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  const toggleComplete = (id: number) => {
    const current = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
    const updated = current.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography>Loading Task...</Typography>
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Error by loading tasks.
      </Typography>
    );

  return (
    <Paper sx={{ p: 3 }}>
      <TaskDetailModal />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Task deleted successfully!
        </Alert>
      </Snackbar>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Task List</Typography>
        <Box gap={1} display="flex" alignItems="center">
          <Button
            component={RouterLink}
            to="/edit/new"
            variant="contained"
            color="primary"
          >
            Add New Task
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleShowCompleted}
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </Button>
        </Box>
      </Stack>
      <TextField
        label="Search tasks"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List>
        {tasks
          ?.filter((task) => showCompleted || !task.completed)
          .filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task, index, filteredTasks) => (
            <TaskItem
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              isLast={index === filteredTasks.length - 1}
            />
          ))}
      </List>
    </Paper>
  );
}

export default TaskList;
