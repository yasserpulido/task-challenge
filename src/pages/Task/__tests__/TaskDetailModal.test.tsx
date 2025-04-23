import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDetailModal from "../TaskDetailModal";
import { useUIStore } from "../../../store";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

jest.mock("../../../store", () => ({
  useUIStore: jest.fn(),
}));

describe("TaskDetailModal", () => {
  const mockSetSelectedTask = jest.fn();

  const task = {
    id: 1,
    title: "Test Task",
    description: "Some description",
    completed: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if no task is selected", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ selectedTask: null, setSelectedTask: mockSetSelectedTask })
    );

    const { container } = render(<TaskDetailModal />);
    expect(container.firstChild).toBeNull();
  });

  it("renders modal with task details", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ selectedTask: task, setSelectedTask: mockSetSelectedTask })
    );

    render(<TaskDetailModal />, { wrapper: WrapperWithRouter });

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(
      screen.getByText("Description: Some description")
    ).toBeInTheDocument();
    expect(screen.getByText("Completed: Yes")).toBeInTheDocument();
  });

  it("calls setSelectedTask(null) when close icon is clicked", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ selectedTask: task, setSelectedTask: mockSetSelectedTask })
    );

    render(<TaskDetailModal />, { wrapper: WrapperWithRouter });

    fireEvent.click(screen.getByLabelText("close"));
    expect(mockSetSelectedTask).toHaveBeenCalledWith(null);
  });

  it("calls setSelectedTask(null) when 'Close' button is clicked", () => {
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ selectedTask: task, setSelectedTask: mockSetSelectedTask })
    );

    render(<TaskDetailModal />, { wrapper: WrapperWithRouter });

    fireEvent.click(screen.getByText("Close"));
    expect(mockSetSelectedTask).toHaveBeenCalledWith(null);
  });

  it("navigates to edit page and closes modal on 'Edit' click", () => {
    const history = createMemoryHistory();
    (useUIStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ selectedTask: task, setSelectedTask: mockSetSelectedTask })
    );

    render(
      <Router history={history}>
        <TaskDetailModal />
      </Router>
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(history.location.pathname).toBe("/edit/1");
    expect(mockSetSelectedTask).toHaveBeenCalledWith(null);
  });
});

// Helper wrapper with Router
const WrapperWithRouter = ({ children }: { children: React.ReactNode }) => {
  const history = createMemoryHistory();
  return <Router history={history}>{children}</Router>;
};
