import { useState, useEffect } from "react";

/**
 * Child of the parent component: Shop.js
 * handleFilters = Pass information from childres: Checkbox.js to parent: Shop.js
 * @param {*} param0
 * @returns
 */
const Checkbox = ({ categories, handleFilters }) => {
  // Check if the category already in the state
  const [checked, setChecked] = useState([]);

  /**
   * This method will execute when there is an unchange event in the checkbox
   * @param {*} c category id
   * @returns
   */
  const handleToggle = (c) => () => {
    // Check if the category already in the state
    // indexOf = return the first index that coincide with the param in the array
    // return -1 = not find
    const currectCategoryId = checked.indexOf(c);

    // All the categories id in the state
    const newCheckedCategoryId = [...checked];

    // If currently checked was not already in checked state, we are going to arr.push()
    // Else pull/take off
    if (currectCategoryId === -1) {
      // -1 = that category is not in state
      // Push to the state and send it as query to BE
      newCheckedCategoryId.push(c);
    } else {
      // Founded index = category already in state
      // Remove it from state and don't send it as query to BE
      newCheckedCategoryId.splice(currectCategoryId, 1);
    }
    // console.log(newCheckedCategoryId);
    setChecked(newCheckedCategoryId);
    // Pass information from childres: Checkbox.js to parent: Shop.js
    handleFilters(newCheckedCategoryId);
  };

  // c = categories
  // i
  return categories.map((c, i) => (
    <li key={i} className="list-unstyled">
      <input
        onChange={handleToggle(c._id)}
        type="checkbox"
        className="form-check-input"
        value={checked.indexOf(c._id === -1)}
      />
      <label className="form-check-label">{c.name}</label>
    </li>
  ));
};

export default Checkbox;
