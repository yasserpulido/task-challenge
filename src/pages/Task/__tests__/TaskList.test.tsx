import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import TaskList from "../TaskList";
import { useUIStore } from "../../../store/useUIStore";
import { fetchTasks } from "../TaskList";
import axios from "axios";

jest.mock("axios");

jest.mock("../../../store/useUIStore", () => ({
  useUIStore: jest.fn(),
}));

jest.mock("../TaskDetailModal", () => () => <div>Task Detail Modal</div>);
jest.mock("../TaskItem", () => {
  return ({ task, deleteTask, toggleComplete }: any) => {
    return (
      <div>
        <span>{task.title}</span>
        <button onClick={() => toggleComplete(task.id)}>Complete</button>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
        <button aria-label="close" onClick={() => {}}>
          Close
        </button>
      </div>
    );
  };
});

jest.mock("@tanstack/react-query", () => {
  const original = jest.requireActual("@tanstack/react-query");
  return {
    ...original,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: () => ({
      invalidateQueries: jest.fn(),
    }),
  };
});

import { useQuery, useMutation } from "@tanstack/react-query";

const mockTasks = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
];

const renderComponent = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <TaskList />
      </QueryClientProvider>
    </MemoryRouter>
  );

describe("TaskList", () => {
  const mockSetSearchTerm = jest.fn();
  const mockToggleShowCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        showCompleted: true,
        toggleShowCompleted: mockToggleShowCompleted,
        searchTerm: "",
        setSearchTerm: mockSetSearchTerm,
      })
    );

    (useMutation as jest.Mock).mockImplementation(
      ({ mutationFn, onSuccess }) => ({
        mutate: async (id: number) => {
          await mutationFn(id);
          onSuccess?.();
        },
      })
    );
  });

  it("toggleComplete keeps other elements intact", () => {
    const multiTasks = [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: true },
    ];
    localStorage.setItem("tasks", JSON.stringify(multiTasks));

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: multiTasks,
    });

    renderComponent();

    fireEvent.click(screen.getAllByText("Complete")[0]); // toggle de la Task 1

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    expect(tasks.find((t: any) => t.id === 2).completed).toBe(true);
  });

  it("fetchTasks fetches from API and stores in localStorage when empty", async () => {
    localStorage.removeItem("tasks");

    const mockData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `Remote Task ${i + 1}`,
      completed: false,
    }));

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await fetchTasks();
    expect(result.length).toBe(10);
    expect(result[0].title).toBe("Remote Task 1");

    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(saved.length).toBe(10);
  });

  it("calls onSuccess after deleting a task", async () => {
    const invalidateQueries = jest.fn();
    (useMutation as jest.Mock).mockImplementation(
      ({ mutationFn, onSuccess }) => ({
        mutate: (id: number) => {
          mutationFn(id).then(() => onSuccess());
        },
      })
    );
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() =>
      expect(screen.getByText(/task deleted successfully/i)).toBeInTheDocument()
    );
  });

  it("toggles a task from completed to not completed", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [{ id: 1, title: "Done Task", completed: true }],
    });

    renderComponent();
    fireEvent.click(screen.getByText("Complete"));

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(tasks[0].completed).toBe(false);
  });

  it("renders loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
    });

    renderComponent();
    expect(screen.getByText(/loading task/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
    });

    renderComponent();
    expect(screen.getByText(/error by loading tasks/i)).toBeInTheDocument();
  });

  it("renders task list and handles delete", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();
    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });
  });

  it("handles task completion toggle", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();
    fireEvent.click(screen.getAllByText("Complete")[0]);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
  });

  it("toggles showCompleted", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /hide completed/i }));
    expect(mockToggleShowCompleted).toHaveBeenCalled();
  });

  it("updates search term", () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();
    const input = screen.getByLabelText(/search tasks/i);
    fireEvent.change(input, { target: { value: "new term" } });
    expect(mockSetSearchTerm).toHaveBeenCalledWith("new term");
  });

  it("filters by search term", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        showCompleted: true,
        toggleShowCompleted: mockToggleShowCompleted,
        searchTerm: "task 1",
        setSearchTerm: mockSetSearchTerm,
      })
    );

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("fetchTasks uses localStorage if data exists", async () => {
    const mockLocalTasks = [{ id: 99, title: "Local Task", completed: false }];
    localStorage.setItem("tasks", JSON.stringify(mockLocalTasks));

    const result = await fetchTasks();
    expect(result).toEqual(mockLocalTasks);
  });

  it("closes the Snackbar when the close button is clicked", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    fireEvent.click(screen.getAllByText("Delete")[0]);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/task deleted successfully/i);

    const closeButtons = screen.getAllByRole("button", { name: /close/i });

    const alertCloseButton = closeButtons.find((btn) =>
      btn.closest('[role="alert"]')
    );

    expect(alertCloseButton).toBeDefined();
    fireEvent.click(alertCloseButton!);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("closes the Snackbar automatically after duration (onClose of Snackbar)", async () => {
    jest.useFakeTimers();

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    fireEvent.click(screen.getAllByText("Delete")[0]);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/task deleted successfully/i);

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("shows 'Show completed' button when showCompleted is false", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        showCompleted: false,
        toggleShowCompleted: mockToggleShowCompleted,
        searchTerm: "",
        setSearchTerm: mockSetSearchTerm,
      })
    );

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    expect(
      screen.getByRole("button", { name: /show completed/i })
    ).toBeInTheDocument();
  });

  it("hides completed tasks when showCompleted is false", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        showCompleted: false,
        toggleShowCompleted: mockToggleShowCompleted,
        searchTerm: "",
        setSearchTerm: mockSetSearchTerm,
      })
    );

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("shows only non-completed tasks matching search term when showCompleted is false", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        showCompleted: false,
        toggleShowCompleted: mockToggleShowCompleted,
        searchTerm: "task 1",
        setSearchTerm: mockSetSearchTerm,
      })
    );

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
    });

    renderComponent();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("toggleComplete keeps other elements intact", () => {
    const originalTasks = [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: true },
    ];
    localStorage.setItem("tasks", JSON.stringify(originalTasks));

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: originalTasks,
    });

    renderComponent();

    fireEvent.click(screen.getAllByText("Complete")[0]);

    const updatedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    expect(updatedTasks.find((t: any) => t.id === 1).completed).toBe(true);

    expect(updatedTasks.find((t: any) => t.id === 2)).toEqual({
      id: 2,
      title: "Task 2",
      completed: true,
    });
  });
});
