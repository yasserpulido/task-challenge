import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import TaskForm, { fetchTask } from "../TaskForm";

jest.mock("../../../store/useUIStore", () => ({
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

  it("shows error when task is not found in edit mode", async () => {
    localStorage.setItem("tasks", JSON.stringify([]));
    setup("/edit/999");

    const errorMsg = await screen.findByTestId("task-not-found");
    expect(errorMsg).toHaveTextContent(/task not found/i);
  });

  it("clears title error on input change", async () => {
    setup("/edit/new");

    fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Fix coverage" },
    });

    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  it("closes the snackbar after autoHideDuration", async () => {
    jest.useFakeTimers();
    setup();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Close snackbar auto" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("navigates to home when clicking back button", () => {
    const { history } = setup("/edit/123");

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(history.location.pathname).toBe("/");
  });

  it("closes the alert when close button is clicked", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Close alert test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("fetchTask returns task data", async () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([{ id: 1, title: "A", description: "" }])
    );
    const data = await fetchTask("1");
    expect(data).toEqual({ title: "A", description: "" });
  });

  it("fetchTask returns empty description when not set", async () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([{ id: 5, title: "No desc" }])
    );
    const task = await fetchTask("5");
    expect(task.description).toBe("");
  });

  it("fetchTask handles empty localStorage", async () => {
    localStorage.removeItem("tasks");
    await expect(fetchTask("1")).rejects.toThrow("Task not found");
  });

  it("edits an existing task and shows success snackbar", async () => {
    jest.useFakeTimers();

    const existingTasks = [
      {
        id: 999,
        title: "Other Task",
        description: "Don't change",
        completed: false,
        userId: 1,
      },
      {
        id: 123,
        title: "Old Task",
        description: "Old description",
        completed: false,
        userId: 1,
      },
    ];
    localStorage.setItem("tasks", JSON.stringify(existingTasks));

    const { history } = setup("/edit/123");

    expect(await screen.findByDisplayValue("Old Task")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Task" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Description" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update task/i }));

    expect(
      await screen.findByText(/task updated successfully/i)
    ).toBeInTheDocument();

    jest.runAllTimers();

    await waitFor(() => {
      expect(history.location.pathname).toBe("/");
    });

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(tasks).toEqual([
      {
        id: 999,
        title: "Other Task",
        description: "Don't change",
        completed: false,
        userId: 1,
      },
      {
        id: 123,
        title: "Updated Task",
        description: "Updated Description",
        completed: false,
        userId: 1,
      },
    ]);

    jest.useRealTimers();
  });
});
