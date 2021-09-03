import { useState, useEffect } from "react";

/**
 * prices = values from fixedPrices.js
 * handleFilters = Pass information from childres: RadioBox.js to parent: Shop.js
 * @param {*} param0
 * @returns
 */
const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0);

  /**
   *
   * @param {*} event
   */
  const handleChange = (event) => {
    // Send the input value to parent component: Shop.js
    handleFilters(event.target.value);
    setValue(event.target.value);
  };

  // p = prices and i = index
  return prices.map((p, i) => (
    <div key={i}>
      <input
        type="radio"
        onChange={handleChange}
        value={`${p._id}`}
        className="mx-2"
        name={p}
      />
      <label className="form-check-label">{p.name}</label>
    </div>
  ));
};

export default RadioBox;
