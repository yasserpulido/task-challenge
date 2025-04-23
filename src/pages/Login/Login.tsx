import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import { useHistory } from "react-router-dom";

import { useAuthStore } from "../../store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      await login(email, password);
      history.push("/");
    } catch (err) {
      setError("Email or password is incorrect");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default Login;
