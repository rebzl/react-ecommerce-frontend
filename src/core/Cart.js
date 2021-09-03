import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

const Cart = () => {
  const [items, setItems] = useState([]); // Get items from response
  const [run, setRun] = useState(false); // This is to avoid the bug infinity loop

  useEffect(() => {
    // Save in state all the items from local storage
    // cartHelpers method to get products from local storage
    setItems(getCart());
  }, [run]); // Whenever there is a change in items, the component will update

  /**
   *
   * @param {*} items
   * @returns html
   */
  const showItem = (items) => {
    return (
      <div>
        <h2>Your cart has {`${items.length}`} items</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        ))}
      </div>
    );
  };

  /**
   * If the cart doesn't have items
   * @returns html
   */
  const noItemsMessage = () => (
    <h2>
      Yout cart is empty. <br />
      <Link to="/shop">Continue Shopping</Link>
    </h2>
  );

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping"
      className="container-fluid mt-5"
    >
      <div className="row">
        <div className="col-6">
          {items.length > 0 ? showItem(items) : noItemsMessage()}
        </div>
        <div className="col-6">
          <h2 className="mb-4">Yout cart summary</h2>
          <hr />
          <Checkout products={items} setRun={setRun} run={run} />
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
