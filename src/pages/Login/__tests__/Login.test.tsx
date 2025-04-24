import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

const mockLogin = jest.fn();
jest.mock("../../../hooks/useLogin", () => ({
  useLogin: () => mockLogin,
}));

import Login from "../Login";

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
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
    const history = createMemoryHistory();
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

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

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(
        screen.getByText(/email or password is incorrect/i)
      ).toBeInTheDocument();
    });
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
