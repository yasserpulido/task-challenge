import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Login from "../Login";
import { useAuthStore } from "../../../store";

jest.mock("../../../store", () => ({
  useAuthStore: jest.fn(),
}));

describe("Login Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it("renders the login form", () => {
    render(
      <Router history={createMemoryHistory()}>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <Router history={createMemoryHistory()}>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <Router history={createMemoryHistory()}>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMessage = await screen.findByText(
      /email or password is incorrect/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("redirects to home page on successful login", async () => {
    const history = createMemoryHistory();
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <Router history={history}>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(history.location.pathname).toBe("/");
  });
});
