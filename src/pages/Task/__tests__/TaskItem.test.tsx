import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../TaskItem";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useUIStore } from "../../../store";

jest.mock("../../../store", () => ({
  useUIStore: jest.fn(),
}));

describe("TaskItem", () => {
  const mockSetSelectedTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockToggleComplete = jest.fn();

  const task = {
    id: 1,
    title: "Test Task",
    description: "Test description",
    completed: false,
    userId: 1,
  };

  const renderWithProviders = () => {
    return render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TaskItem
            task={task}
            deleteTask={mockDeleteTask}
            toggleComplete={mockToggleComplete}
          />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ setSelectedTask: mockSetSelectedTask })
    );
  });

  it("renders task title", () => {
    renderWithProviders();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("calls setSelectedTask on title click", () => {
    renderWithProviders();
    fireEvent.click(screen.getByText("Test Task"));
    expect(mockSetSelectedTask).toHaveBeenCalledWith(task);
  });

  it("calls toggleComplete on button click", () => {
    renderWithProviders();
    const toggleButton = screen.getByTestId("toggle-complete");
    fireEvent.click(toggleButton);
    expect(mockToggleComplete).toHaveBeenCalledWith(task.id);
  });

  it("calls deleteTask on delete icon click", () => {
    renderWithProviders();
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockDeleteTask).toHaveBeenCalledWith(task.id);
  });
});
