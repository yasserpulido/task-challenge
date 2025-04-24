import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
