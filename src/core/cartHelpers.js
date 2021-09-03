/**
 * Add item to local storage to save it in the cart
 * @param {*} item
 * @param {*} next
 */
export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== "undefined") {
    // Get item from the local storage and save it in cart array
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({
      ...item,
      count: 1,
    });

    // Remove duplicated items
    // Build an Array from new set and turn it back into array using Array.form
    // So that later we can re-map it
    // New set will only allow unique values in it.
    // So pass the ids of each object/product
    // If the loop tries to add the same value again, it'll get ignored
    // ...with the array of ids we ot on when first map() was used
    // run map() on it again and return the actual product from the cart
    cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
      return cart.find((p) => p._id === id);
    });

    // Save items to local storage cart
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

/**
 * If there is item in cart (local storage)
 * return the length
 * Else
 * return 0
 * @returns items in cart length
 */
export const itemTotal = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")).length;
    }
  }
  return 0;
};

/**
 * Get all products from local storage
 * @returns cart response
 */
export const getCart = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
};

/**
 * Update item count in local storage
 * @param {*} productId
 * @param {*} count
 *
 */
export const updateItem = (productId, count) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.map((product, i) => {
      if (product._id === productId) {
        // Find the product and update it count
        cart[i].count = count;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

/**
 * Remove item from local storage
 * @param {*} productId
 */
export const removeItem = (productId) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.map((product, i) => {
      if (product._id === productId) {
        // Find the product and remove it
        // splice(indexProduct, howManyToSplice)
        cart.splice(i, 1);
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
};

/**
 * Clear items from local storage
 * @param next callback to perform an action
 */
export const emptyCart = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
    next();
  }
};
