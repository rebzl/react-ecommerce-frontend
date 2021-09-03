import { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProduct } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  // State to Store category or price filter values and send it to the backend
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }, // Caregory id or price array
  });
  // States that will be send to the getFilteredProduct() to call BE method: getProduts by search
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0); // Use it to load more product
  const [size, setSize] = useState(0);

  // Display product result with filter. Store the BE array
  const [filteredResult, setFilteredResult] = useState([]);

  /**
   * Load categories
   * Called in useEffect
   */
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  /**
   * Load the filtered products
   * Give all the products based on the filters
   * Call BE
   * @param {*} newFilters
   */
  const loadFilterResults = (newFilters) => {
    // Call BE
    getFilteredProduct(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        // Give all the products based on the filters
        setFilteredResult(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  useEffect(() => {
    init();
    loadFilterResults(myFilters.filters);
  }, []);

  /**
   * Use to get selected category from the child component: Checkbox.js
   * Everytime user click an input, this function is called
   * filters = Array of categories and prices
   * filterBy = Can be category or price
   * @returns
   */
  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    // Save in category or price values in myFilters state
    newFilters.filters[filterBy] = filters;

    // if filterBy is price, get the array value from _id
    if (filterBy == "price") {
      // Grap price id and return array
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }

    loadFilterResults(myFilters.filters);

    setMyFilters(newFilters);
  };

  /**
   * Get the price array value from _id
   * @param {*} value
   * @return price array Ex:[1-0]
   */
  const handlePrice = (value) => {
    const data = prices; // Comes from ./fixedPrices
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  /**
   * Excecute load more btn
   */
  const loadMore = () => {
    console.log(`${skip} ${limit}`);
    let toSkip = skip + limit;
    getFilteredProduct(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        // ...filteredResult = get all data
        setFilteredResult([...filteredResult, ...data.data]);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  /**
   * Button to load more
   * @returns html
   */
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load More
        </button>
      )
    );
  };

  return (
    <Layout
      title="Shop Page"
      description="Sort and find books of your choise"
      className="container-fluid mt-5"
    >
      <div className="row">
        <div className="col-4">
          <h4>Filter by Categories</h4>
          <ul>
            <Checkbox
              categories={categories}
              // Pass information from childres: Checkbox.js to parent: Shop.js
              handleFilters={(filters) => handleFilters(filters, "category")}
            />
          </ul>

          <h4>Filter by Prices</h4>
          <div>
            <RadioBox
              prices={prices}
              //handleFilters = Pass information from childres: Checkbox.js to parent: Shop.js
              handleFilters={(filters) => handleFilters(filters, "price")}
            />
          </div>
        </div>
        <div className="col-8">
          <h2 className="mb-4">Products</h2>
          <div className="row">
            {filteredResult.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <Card product={product} />
              </div>
            ))}
            {/*JSON.stringify(filteredResult)} */}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
