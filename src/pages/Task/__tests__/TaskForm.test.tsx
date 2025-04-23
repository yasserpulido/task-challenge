import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TaskForm from "../TaskForm";

jest.mock("../../../store", () => ({
  useUIStore: jest.fn(() => ({
    selectedTask: null,
    setSelectedTask: jest.fn(),
  })),
}));

describe("TaskForm", () => {
  const setup = (initialPath = "/edit/new") => {
    const history = createMemoryHistory({ initialEntries: [initialPath] });
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <Route path="/edit/:id">
            <TaskForm />
          </Route>
        </Router>
      </QueryClientProvider>
    );

    return { history };
  };

  it("renders form with empty fields in creation mode", () => {
    setup();
    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it("adds a new task and shows success snackbar", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Details" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/task created successfully/i)
      ).toBeInTheDocument();
    });
  });
});
