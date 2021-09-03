import { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [error, setError] = useState("");

  // Destruct
  const { user, token } = isAuthenticated();

  /**
   * Load all the orders from BE
   * Call BE
   */
  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
        setError(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  /**
   * Load all the orders status values from BE
   * Call BE
   */
  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  /**
   * Call BE to set order status value
   * @param {*} e event
   * @param {*} orderId
   */
  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        loadOrders();
      }
    });
  };

  /**
   *
   * @returns html orders or no orders message
   */
  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className="text-danger display-2">Total orders: {orders.length}</h1>
      );
    } else {
      return <h1 className="text-danger">No Orders</h1>;
    }
  };

  /**
   *
   * @param {*} key : Product name, product price, etc
   * @param {*} value
   * @returns html input products
   */
  const showInput = (key, value) => (
    <div className="input-group mb-2 mr-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input text="text" value={value} className="form-control" readOnly />
    </div>
  );

  /**
   *
   * @param {*} o order
   * @returns html to show order status values
   */
  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status:{o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update Status</option>
        {statusValues.map((status, i) => (
          <option key={i} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout
      title="Orders"
      description={`G'day ${user.name} you can manage all the orders here`}
      className="container mt-5"
    >
      <div>
        {showOrdersLength()}
        {orders.map((order, oIndex) => {
          return (
            <div
              key={oIndex}
              className="mt-5"
              style={{ borderBottom: "5px solid indigo" }}
            >
              <h2 className="mb-5">
                <span className="bg-primary">Order ID: {order._id}</span>
              </h2>
              <ul className="list-group mb-2">
                <li className="list-group-item">{showStatus(order)}</li>
                <li className="list-group-item">
                  Transaction Id: {order.transaction_id}
                </li>
                <li className="list-group-item">Amount: {order.amount}</li>
                <li className="list-group-item">
                  Ordered by: {order.user.name}
                </li>
                <li className="list-group-item">
                  Ordered on: {moment(order.createdAt).fromNow()}
                </li>
                <li className="list-group-item">
                  Delivery Address: {order.address}
                </li>
              </ul>

              <h3 className="mt-4 mb-4 font-italic">
                Total products in the order: {order.products.length}
              </h3>
              {order.products.map((p, pIndex) => (
                <div
                  key={pIndex}
                  className="mb-4"
                  style={{ padding: "20px", border: "1px solid indigo" }}
                >
                  {showInput("Product name", p.name)}
                  {showInput("Product price", p.price)}
                  {showInput("Product total", p.count)}
                  {showInput("Product Id", p._id)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Orders;
