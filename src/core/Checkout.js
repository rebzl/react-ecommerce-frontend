import { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import {
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from "./apiCore";
import DropIn from "braintree-web-drop-in-react"; // Display a UI form for credit card
import { emptyCart } from "./cartHelpers";

const Checkout = ({
  products,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [data, setData] = useState({
    success: false,
    clientToken: null, // Receive the response from BE
    error: "",
    instance: {}, // Save payment information in the Drop in form
    address: "",
    loading: false,
  });

  // Get user id and token from BE
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  /**
   * Get braintree client token
   * Call BE method
   * @param {*} userId
   * @param {*} token
   */
  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  /**
   * Get the total prices of items in local storage (cart)
   */
  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  // Store the address of the state in a new variable, so we don't have variable names conflict
  let deliveryAddress = data.address;

  /**
   * Send drop in form information (payment) as a token called as nonce
   * and total to charge to BE method to process transaction
   * Process transaction
   */
  const buy = () => {
    setData({ loading: true });
    // Send the nonce to your server (BE)
    // nonce = data.instance.requestPaymentMethod()
    let nonce;

    let getNonce = data.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        // Once you have nonce (card type, card number, etc) send nonce as 'paymentMethodNonce' to the BE
        // And total to be charge to de BE
        const paymentData = {
          paymentMethodNonce: nonce, // drop in response token
          amount: getTotal(products),
        };
        // Call BE
        // If order created successfully in brain tree:
        // 1. Save order in data base
        // 2. Set state to show success message
        // 3. Empty cart
        processPayment(userId, token, paymentData)
          .then((response) => {
            console.log(response);
            // Create order / Save it in DB
            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id, // Can see the response information when console.log(response)
              amount: response.transaction.amount,
              address: deliveryAddress,
            };
            // Call BE
            createOrder(userId, token, createOrderData)
              .then((response) => {
                // Call cartHelpers to empty local storage
                // Empty cart
                emptyCart(() => {
                  // Set state
                  setRun(!run);
                  setData({
                    success: true,
                    loading: false,
                  });
                });
              })
              .catch((error) => {
                console.log(error);
                setData({ loading: false, error: error });
              });
          })
          .catch((error) => {
            console.log(error);
            setData({ loading: false, error: error });
          });
      })
      .catch((err) => {
        setData({ ...data, error: err.message });
      });
  };

  /**
   * Handle whatever user is typing in the address text area
   * Save it in the state.address
   * @param {*} event
   */
  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  /**
   *
   * @returns showDropIn or signin checkout btn
   */
  const showCheckout = () =>
    isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to="./signin">
        <button className="btn btn-primary">Signin to Checkout</button>
      </Link>
    );

  /**
   *
   * @returns braintree html
   */
  const showDropIn = () => (
    // onBlur = click anywhere on the div, will execute an action
    // Clean de error when onBlur
    <div onBlur={() => setData({ ...data, error: "" })}>
      {/* Check if client token is not null and there is product in the cart */}
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  /**
   *
   * @param {*} error
   * @returns html error message
   */
  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  /**
   *
   * @param {*} success
   * @returns html success message
   */
  const showSuccess = (success) => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks! Your payment was successfully
    </div>
  );

  const showLoading = (loading) => loading && <h2>Loading...</h2>;

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showError(data.error)}
      {showSuccess(data.success)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
