import { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "", // To store all the form data and send it to the BE body
  });

  // Destruct State values
  const {
    name,
    description,
    price,
    categories,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
  } = values;

  // Destruct isAuthenticated
  const { user, token } = isAuthenticated();

  /**
   * Call this method in useEffect
   * Load current product in form
   * @param {*} productId From url
   */
  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // Populate de state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category._id,
          shipping: data.shipping,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // Load categories
        initCategories();
      }
    });
  };

  /**
   * Call this method in useEffect
   * Load categories to populated in form select
   * Load form data
   * @param {*} name
   * @returns
   */
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        // Error
        setValues({ ...values, error: data.error });
      } else {
        // Success
        setValues({ categories: data, formData: new FormData() });
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  /**
   * Save in state input values and file
   * name = the name of each input, need to be the same as the names of the DB, because this is what we are going to send as body.
   * @param {*} name
   * @returns
   */
  const handleChange = (name) => (event) => {
    // If the name of the input is photo, we will going to grap the target file because it is a photo. Else, get de value of the input

    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    // [name] = Name of the input to know which input user is typing and to kwno which state to change
    // value = The value of the input
    setValues({ ...values, [name]: value });
  };

  /**
   * Call BE and submit data
   * @param {*} event
   */
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    // Method to call BE
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        console.log(data);
        if (data.error) {
          // If BE return an error, stored the BE error message
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            photo: "",
            price: "",
            quantity: "",
            loading: false,
            createdProduct: data.name, // The name of whatever we receive from the response
          });
        }
      }
    );
  };

  /**
   *  Display add product form
   * @returns html
   */
  const newProductForm = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          {/* name = photo, because the BE is named as photo  
                image/* = Accept everything. Ex: .png, .jpg, etc.*/}
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please select...</option>
          {/* Populate categories from de BE with arr.map()  */}
          {/* c = category, i = index  */}
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Shipping</label>
        <select onChange={handleChange("shipping")} className="form-control">
          <option>Please select...</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          className="form-control"
          value={quantity}
        />
      </div>
      <button className="btn btn-outline-primary">Update product</button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdProduct ? "" : "none" }}
    >
      {`${createdProduct} is updated successfully`}
    </div>
  );

  const showLoading = () =>
    loading && <div className="alert alert-success">Loading...</div>;

  return (
    <Layout
      title="Add a new Product"
      description={`G'day ${user.name} ready to add new product?`}
      className="container mt-5"
    >
      <div>
        {showLoading()}
        {showError()}
        {showSuccess()}
        {newProductForm()}
      </div>
    </Layout>
  );
};

export default UpdateProduct;
