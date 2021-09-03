import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

/**
 * Private route so only logged in user can access
 * If user is logged in and with a role of 1 -> send props
 * If not, redirect to signin
 * ...rest = rest of the components
 * @param {*} param0
 */
const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() && isAuthenticated().user.role === 1 ? (
        // If user is authenticated and admin
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

export default AdminRoute;
