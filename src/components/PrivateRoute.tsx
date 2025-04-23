import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useAuthStore } from "../store";

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!Component) return null;

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
