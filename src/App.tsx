import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { TaskForm, TaskList } from "./components";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <Switch>
            <Route exact path="/" component={TaskList} />
            <Route path="/edit/:id" component={TaskForm} />
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
