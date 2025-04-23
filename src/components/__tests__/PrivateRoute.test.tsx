import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { useAuthStore } from "../../store";

jest.mock("../../store", () => ({
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
});
