import { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
  const [data, setData] = useState({
    categories: [], // API request to get all categories
    category: "", // Store the category user selected
    search: "", // Store the values user is typing
    results: [], // Store the response from BE
    searched: false, // To check if user is already searched
  });

  // Desctruct
  const { categories, category, search, results, searched } = data;

  /**
   * Call BE
   * Use in useEffect
   * @returns All categories from BE
   */
  const loadCategories = () => {
    // Call BE
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Store in category and search state the values user typed
   * @param {*} name Name of the inputs, in this case is category and search
   * @returns
   */
  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  /**
   * @param {*} event
   */
  const searchSubmit = (event) => {
    event.preventDefault();
    searchData();
  };

  /**
   * Send info to BE
   */
  const searchData = () => {
    if (search) {
      // search = input value typed from search input
      // category = input selected from dropdown category
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  /**
   * Display search form and category select
   * @returns html
   */
  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            {/* Dropdown all category  */}
            <select className="btn mr-2" onChange={handleChange("category")}>
              <option value="All">All</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* Search Input  */}
          <input
            type="search"
            className="form-control"
            onChange={handleChange("search")}
            placeholder="Search by name"
          />
        </div>
        <div className="btn input-group-append" style={{ border: "none" }}>
          <button className="input-group-text">Search</button>
        </div>
      </span>
    </form>
  );

  /**
   *
   * @param {*} searched true (products found) or false (products not found)
   * @param {*} results result of the response of the BE call
   * @returns html
   */
  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      // At least one or more products was found
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      // Not found any product
      return `No products found`;
    }
  };

  /**
   * Load the searched products
   * @param {*} results the response of the BE method
   * @returns html
   */
  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className="mt-4 mb-4">{searchMessage(searched, results)}</h2>
        <div className="row">
          {results.map((product, i) => (
            <Card key={i} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      <div className="container">{searchForm()}</div>
      <div className="container-fluid">{searchedProducts(results)}</div>
      {/* {JSON.stringify(results)} */}
    </div>
  );
};
export default Search;
