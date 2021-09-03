import { API } from '../config';
/**
 * Method to send data to the backend api with fetch
 * The backend will received it and save it in the userSchema
 * @param {*} name
 * @param {*} email
 * @param {*} password
 */
export const signup = (user) =>
  fetch(`${API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user), // JSON.stringify =  convert plain text into json
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });

/**
 * Method to user signin
 * @param {*} email
 * @param {*} password
 */
export const signin = (user) =>
  fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user), // JSON.stringify =  convert plain text into json
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });

/**
 * Save information in browser local storage
 * data = user information
 * next() [callback function] = send a method throght parameter. In this case, the method is to set redirect to true
 */
export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    // Set values en local storage
    // Save data in local storage with the name of jwt
    localStorage.setItem('jwt', JSON.stringify(data));
    // Callback
    next();
  }
};

/**
 * Param callback
 * Remove data from local storage
 * Call BackEnd method for signout
 * Redirect user, we will use the callback for redirect
 */
export const signout = (next) => {
  if (typeof window !== 'undefined') {
    // Remove data from local storage
    localStorage.removeItem('jwt');
    // Redirect user to home page
    next();
    // Call BE to signout
    return fetch(`${API}/signout`, {
      method: 'GET',
    })
      .then((response) => {
        console.log('signout', response);
      })
      .catch((err) => console.log(err));
  }
};

/**
 * Verify if user is logged in
 * If it is authenticated, return user
 * If it is not authenticated, return false
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  // If user access to the local storage
  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt')); // Contain token and user information
  }
  return false;
};
