import { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { signin, authenticate, isAuthenticated } from "../auth";

const Signin = () => {
  // States
  const [values, setValues] = useState({
    email: "rebz9@gmail.com",
    password: "Test1234",
    error: "",
    loading: false,
    redirectToReferrer: false, // Redirect the user
  });

  // Distruct state, so it can be easily called
  const { email, password, error, loading, redirectToReferrer } = values;

  // Distruct user:{_id, name, email, role}
  const { user } = isAuthenticated();

  /**
   * This will be a function returning another function
   * onChange = Everytime the signUpForm input change, it will excecute handleChange method
   * name = the name of each signUpForm input (name, email, password)
   *
   */
  const handleChange = (name) => (event) => {
    // ... = rest of the values
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  /**
   * Send data of state values to the backend
   */
  const clickSubmit = (event) => {
    // Brownser don't realod when submit is clicked
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    // Put {} to wrap the 3 param as 1 and called user.
    // signup = comes from auth/index.js
    signin({ email, password }).then((data) => {
      if (data.error) {
        // Error
        setValues({ ...values, error: data.error, loading: false });
      } else {
        // Success
        // Store data in local storate
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true, // Redirect user to another page
          });
        });
      }
    });
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      {/* When the buttom is clicked, need to send the data to the backend */}
      <buttom onClick={clickSubmit} className="btn btn-primary mt-4">
        Submit
      </buttom>
    </form>
  );

  /**
   * Display error message
   */
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  /**
   * Display success message
   */
  const showLoading = () =>
    // If loading = true, the alert will be displayed
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );

  /**
   * Method to redirect the user only when redirectToReferrer: true
   */
  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  return (
    <Layout
      title="Signin"
      description="Signin to Node React E-commerce App"
      className="container col-md-8 offset-md-2 mt-5"
    >
      {showError()}
      {showLoading()}
      {signUpForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
