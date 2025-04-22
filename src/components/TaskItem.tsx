import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Task } from "../types";
import { ListItem, ListItemText, IconButton, Box, Stack, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  task: Task;
  deleteTask: (id: number) => void;
  isLast?: boolean;
};

function TaskItem({ task, deleteTask, isLast }: Props) {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  
  return (
    <ListItem divider={!isLast} disableGutters>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        spacing={1}
        flexWrap="nowrap"
      >
        <ListItemText
          primary={task.title}
          primaryTypographyProps={{
            noWrap: true,
            sx: {
              maxWidth: isSmall ? "65%" : "85%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <IconButton
            component={RouterLink}
            to={`/edit/${task.id}`}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="error"
            aria-label="delete"
            onClick={() => deleteTask(task.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Stack>
    </ListItem>
  );
}

export default TaskItem;
