import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup } from '../auth';

const Signup = () => {
  // States
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
  });

  // Distruct state, so it can be easily called
  const { name, email, password, error, success } = values;

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
    setValues({ ...values, error: false });
    // Put {} to wrap the 3 param as 1 and called user.
    // signup = comes from auth/index.js
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        // Error
        setValues({ ...values, error: data.error, success: false });
      } else {
        // Success
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
        });
      }
    });
  };

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          value={name} // This name from the distructor of the state
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange('email')}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange('password')}
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
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  /**
   * Display success message
   */
  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? '' : 'none' }}
    >
      New account created. Please <Link to="/signin">Signin</Link>
    </div>
  );

  return (
    <Layout
      title="Signup"
      description="Signup to Node React E-commerce App"
      className="container col-md-8 offset-md-2 mt-5"
    >
      {showError()}
      {showSuccess()}
      {signUpForm()}
    </Layout>
  );
};

export default Signup;
