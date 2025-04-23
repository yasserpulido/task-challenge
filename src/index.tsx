import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import reportWebVitals from "./reportWebVitals";
import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useUIStore } from "./store/useUIStore";
import { darkTheme, lightTheme } from "./theme";

const theme = createTheme();
const queryClient = new QueryClient();

function Root() {
  const darkMode = useUIStore((state) => state.darkMode);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
