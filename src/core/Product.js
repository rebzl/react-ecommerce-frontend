import { useState, useEffect } from "react";
import Layout from "./Layout";
import { loadProduct, listRelated } from "./apiCore";
import Card from "./Card";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);

  /**
   * Load the product
   * Call method from BE
   * Use in useEffect
   * @param {*} productId
   */
  const loadSingleProduct = (productId) => {
    // Call method from BE
    loadProduct(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // Fetch related products
        // Call BE
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    // Grap product id from url
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      title={product && product.name}
      description={
        product && product.description && product.description.substring(0, 100)
      }
      className="container-fluid mt-5"
    >
      <div className="row">
        <div className="col-8">
          {product && product.description && (
            <Card product={product} showViewProductButton={false} />
          )}
        </div>
        <div className="col-4">
          <h4>Related Products</h4>
          {relatedProduct &&
            relatedProduct.map((product, i) => (
              <div className="mb-3">
                <Card key={i} product={product} />
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
