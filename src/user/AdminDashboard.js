import Layout from "../core/Layout";
import { isAuthenticated } from "../auth"; // To get the local storage information and display it in dashboard
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Distruct
  const {
    user: { name, email, role },
  } = isAuthenticated();

  /**
   * Link to update profile, cart, and other part of the website
   * @returns html
   */
  const adminLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">Admin Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/admin/orders">
              View Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  /**
   * Display user infomation
   * @returns html
   */
  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">Admin Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Admin Dashboard"
      description={`G'day ${name}`}
      className="container-fluid mt-5"
    >
      <div className="row">
        <div className="col-3">{adminLinks()}</div>
        <div className="col-9">{adminInfo()}</div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
