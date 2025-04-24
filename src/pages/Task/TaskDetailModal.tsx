import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";

function TaskDetailModal() {
  const selectedTask = useUIStore((state) => state.selectedTask);
  const setSelectedTask = useUIStore((state) => state.setSelectedTask);
  const history = useHistory();

  const handleClose = () => setSelectedTask(null);

  if (!selectedTask) return null;

  return (
    <Dialog open={!!selectedTask} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedTask.title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Description: {selectedTask.description || "(No description)"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Completed: {selectedTask.completed ? "Yes" : "No"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            history.push(`/edit/${selectedTask.id}`);
            handleClose();
          }}
        >
          Edit
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDetailModal;
