import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Switch, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import PrivateRoute from "../PrivateRoute";
import { useAuthStore } from "../../store/useAuthStore";

jest.mock("../../store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

const TestComponent = () => <div>Private Content</div>;

describe("PrivateRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders component if user is authenticated", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ user: { id: 1 } });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Switch>
          <PrivateRoute path="/private" component={TestComponent} />
        </Switch>
      </MemoryRouter>
    );

    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });

  it("redirects to /login if user is not authenticated", async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ user: null })
    );

    const history = createMemoryHistory({ initialEntries: ["/private"] });

    render(
      <Router history={history}>
        <Switch>
          <PrivateRoute path="/private" component={TestComponent} />
          <Route path="/login">
            <div>Login Page</div>
          </Route>
        </Switch>
      </Router>
    );

    await waitFor(() => {
      expect(history.location.pathname).toBe("/login");
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
