import { useState } from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Destruct user and token from localstorage
  const { user, token } = isAuthenticated();

  /**
   * Wrap whatever user is typing and set the states.
   * e.target.value = whatever user is typing
   * @param {*} e
   */
  const handleChange = (e) => {
    setError("");
    setName(e.target.value);
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Make request to api to create category
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        // Error
        setError(data.error);
      } else {
        // Success
        setError("");
        setSuccess(true);
      }
    });
  };

  /**
   * Create new category form
   * @returns html
   */
  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group mb-3">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
          required
        />
      </div>
      <button className="btn btn-outline-primary">Create Category</button>
    </form>
  );

  /**
   * Display success mesage
   * @returns html
   */
  const showSuccess = () => {
    if (success) {
      return <h3 className="text-success">{name} is created successfully</h3>;
    }
  };

  /**
   * Displar error message
   * @returns html
   */
  const showError = () => {
    if (error !== "") {
      return <h3 className="text-danger">{name} category should be unique</h3>;
    }
  };

  /**
   * Display Back to Dashboard link
   * @returns html
   */
  const goBack = () => (
    <div className="mt-5">
      <Link to="/admin/dashboard" className="text-warning">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout
      title="Add new category"
      description={`G'day ${user.name}, ready to add new category?`}
      className="container"
    >
      <div>
        {showSuccess()}
        {showError()}
        {newCategoryForm()}
        {goBack()}
      </div>
    </Layout>
  );
};

export default AddCategory;
