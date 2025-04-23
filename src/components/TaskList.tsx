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

import TaskItem from "./TaskItem";
import { Task } from "../types";

const fetchTasks = async (): Promise<Task[]> => {
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
        {tasks?.map((task) => (
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
