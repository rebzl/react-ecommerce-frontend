import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItem, removeItem } from "./cartHelpers";

/**
 * Display product info
 * @param {*} param0
 * @returns html
 */
const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  // product.count = the amount of repeated products in the cart
  const [count, setCount] = useState(product.count);

  /**
   * Display or not view single product button
   * @param {*} showViewProductButton true or false
   * @returns html
   */
  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2">
            View Product
          </button>
        </Link>
      )
    );
  };

  /**
   * Call BE method
   *
   */
  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  /**
   * Redirect to cart
   * @param {*} redirect true or false
   * @returns cart component
   */
  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  /**
   * Show add to cart button
   * @param showAddToCartButton true or false sent from the props
   * @returns html
   */
  const showAddToCart = (showAddToCartButton) => {
    return (
      // Only show add to cart button if showAddToCartButton is true
      showAddToCartButton && (
        <button
          onClick={addToCart}
          className="btn btn-outline-warning mt-2 mb-2"
        >
          Add to cart
        </button>
      )
    );
  };

  /**
   *
   * @param {*} quantity
   * @returns html
   */
  const showStock = (quantity) => {
    return quantity > 0 ? (
      // In stock
      <span className="badge bg-primary">In Stock</span>
    ) : (
      // Out of stock
      <span className="badge bg-primary">Out of Stock</span>
    );
  };

  /**
   * It is execute everytime the qty input is changed
   * Handle the qty input changes and set local storage calling method from cartHelpers
   * @param {*} productId
   * @returns
   */
  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    // User cannot update the qty < 1
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      // Method from cartHelpers
      updateItem(productId, event.target.value);
    }
  };

  /**
   *
   * @param {*} cartUpdate = true -> display update option // false -> don't display
   * @returns html
   */
  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div>
          <div className="input inpur-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-group"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  /**
   *
   * @param {*} showRemoveProductButton if true -> show btn // else false -> Don't show btn
   * @returns
   */
  const showRemoveButton = (showRemoveProductButton) => {
    return (
      // Only show remove from cart button if showRemoveButton is true
      showRemoveProductButton && (
        <button
          // removeItem -> comes from cartHelpers.js
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header name">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        {/* substring = limit the amount of letter  */}
        <p className="lead mt-2">{product.description.substring(0, 50)}</p>
        <p className="black-10">{product.price}</p>
        <p className="black-9">
          Category: {product.category && product.category.name}
        </p>
        <p className="black-8">
          {/* moment: react library to see date more friendly. Ex: 21 hours ago  */}
          Added on {moment(product.createdAt).fromNow()}
        </p>

        {showStock(product.quantity)}
        <br />
        {showViewButton(showViewProductButton)}
        {showAddToCart(showAddToCartButton)}
        {showRemoveButton(showRemoveProductButton)}
        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
