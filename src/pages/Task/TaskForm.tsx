import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "../../types";

export const fetchTask = async (id: string) => {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) throw new Error("Task not found");
  return {
    title: task.title,
    description: task.description || "",
  };
};

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const isEditing = id !== "new";

  const [task, setTask] = useState({ title: "", description: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id!),
    enabled: isEditing,
    retry: false,
  });

  useEffect(() => {
    if (data) setTask(data);
  }, [data]);

  const saveTaskMutation = useMutation({
    mutationFn: (taskData: { title: string; description: string }) => {
      const current = JSON.parse(localStorage.getItem("tasks") || "[]");
      const newId = isEditing
        ? parseInt(id!)
        : Math.floor(Math.random() * 100000);
      const updated = isEditing
        ? current.map((t: Task) => (t.id === newId ? { ...t, ...taskData } : t))
        : [...current, { ...taskData, id: newId, completed: false, userId: 1 }];
      localStorage.setItem("tasks", JSON.stringify(updated));
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpenSnackbar(true);
      setTimeout(() => history.push("/"), 1000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string } = {};
    if (!task.title.trim()) newErrors.title = "Title is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    saveTaskMutation.mutate(task);
  };

  const renderContent = () => {
    if (isEditing && error) {
      return (
        <Typography color="error" role="alert" data-testid="task-not-found">
          Task not found.
        </Typography>
      );
    }

    if (isEditing && isLoading) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
          <Typography>Loading task...</Typography>
        </Box>
      );
    }

    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={task.title}
            fullWidth
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            error={Boolean(errors.title)}
            helperText={errors.title}
          />
          <TextField
            label="Description"
            value={task.description}
            fullWidth
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={saveTaskMutation.isPending || openSnackbar}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {isEditing ? "Task updated" : "task created"} successfully!
        </Alert>
      </Snackbar>
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
          {isEditing ? "Edit Task" : "Add New Task"}
        </Typography>
        {renderContent()}
      </Stack>
    </Paper>
  );
}

export default TaskForm;
