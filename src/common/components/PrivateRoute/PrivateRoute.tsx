import React from "react";
import { Navigate, Route } from "react-router-dom";
import { isLoggedIn } from "../../../utils/cookies-utils";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      {...rest}
      Component={(props: any) =>
        isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" replace={true} />
        )
      }
    />
  );
};

export default PrivateRoute;
