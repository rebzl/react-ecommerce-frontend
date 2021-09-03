import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

/**
 * Private route so only logged in user can access
 * If user is logged in -> send props
 * If not, redirect to signin
 * ...rest = rest of the components
 * @param {*} param0
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        // If user is authenticated
        <Component {...props} />
      ) : (
        // If user is not authenticated
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
