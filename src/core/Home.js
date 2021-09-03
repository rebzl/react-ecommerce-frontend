import { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setproductsByArrival] = useState([]);
  const [error, setError] = useState("");

  /**
   * Get products by sell from de BE
   * sold param is the name of the field in the BD
   */
  const loadProductBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        // Error
        setError(data.error);
      } else {
        // Success
        setProductsBySell(data);
      }
    });
  };

  /**
   * Get products by new arrival from de BE
   * createdAt param is the name of the field in the BD
   */
  const loadProductByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        // Error
        setError(data.error);
      } else {
        // Success
        setproductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductByArrival();
    loadProductBySell();
  }, []);

  return (
    <Layout
      title="Home Page"
      description="Node React E-commerce App"
      className="container-fluid mt-5"
    >
      <Search />
      <h2 className="mb-4">Best Sellers</h2>
      <div className="row">
        {/* Loop productsBySell and pass as prop the key and product  */}
        {productsBySell.map((product, i) => (
          <div key={i} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-5">New Arrivals</h2>
      <div className="row">
        {/* Loop productsByArrival and pass as prop the key and product  */}
        {productsByArrival.map((product, i) => (
          <div key={i} className="col-4 mb-3">
            <Card product={product} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
