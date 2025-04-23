import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import TaskList from "../TaskList";
import { useUIStore } from "../../../store";

// Mocks
jest.mock("../../../store", () => ({
  useUIStore: jest.fn(),
}));

jest.mock("../TaskDetailModal", () => () => <div>Task Detail Modal</div>);
jest.mock("../TaskItem", () => ({ task, deleteTask, toggleComplete }: any) => (
  <div>
    <span>{task.title}</span>
    <button onClick={() => toggleComplete(task.id)}>Complete</button>
    <button onClick={() => deleteTask(task.id)}>Delete</button>
  </div>
));

// Mocks de react-query
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

    (useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn((id, options) => options?.onSuccess?.()),
    });
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
    (useUIStore as jest.Mock).mockImplementation((selector) =>
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
});
