import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  FormControlLabel,
  Toolbar,
  Typography,
  Switch as MuiSwitch,
  Button,
} from "@mui/material";

import { PrivateRoute } from "./components";
import { useAuthStore, useUIStore } from "./store";
import { Login, TaskForm, TaskList } from "./pages";

function App() {
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Task Manager</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <MuiSwitch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="primary"
                />
              }
              label={darkMode ? "Dark Mode" : "Light Mode"}
            />
            {user && (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={TaskList} />
            <PrivateRoute path="/edit/:id" component={TaskForm} />
            <Route path="*">
              <Redirect to={user ? "/" : "/login"} />
            </Route>
          </Switch>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
