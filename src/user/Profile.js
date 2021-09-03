import { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth"; // To get the local storage information and display it in dashboard
import { Link, Redirect } from "react-router-dom";
import { read, update, updateUser } from "./apiUser";

const Profile = (props) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  // Destruct
  const { name, email, password, error, success } = values;
  const { token } = isAuthenticated();

  const init = (userId) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          email: data.email,
        });
      }
    });
  };

  useEffect(() => {
    init(props.match.params.userId);
  }, []);

  /**
   *
   * @param {*} name
   * @returns Save data in state
   */
  const handleChange = (name) => (e) => {
    setValues({ ...values, error: "", [name]: e.target.value });
  };

  /**
   * Call BE
   * Update BE and local storage
   * @param {*} e event
   * @returns response with updated data
   */
  const clickSubmit = (e) => {
    e.preventDefault();
    // Call BE to update BD
    update(props.match.params.userId, token, { name, email, password }).then(
      (data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, error: data.error });
        } else {
          // Call updateUser to update local storage
          updateUser(data, () => {
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true,
            });
          });
        }
      }
    );
  };

  const redirectUser = (success) => {
    if (success) {
      return <Redirect to="/user/dashboard" />;
    }
  };
  /**
   *
   * @param {*} name state
   * @param {*} email state
   * @param {*} password state
   * @returns html update form
   */
  const profileUpdate = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={clickSubmit}>
        Submit
      </button>
    </form>
  );

  return (
    <Layout
      title="Profile"
      description={`Update your profile`}
      className="container-fluid mt-5"
    >
      <h2>Profile Update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
