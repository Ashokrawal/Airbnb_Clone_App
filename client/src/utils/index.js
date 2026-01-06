/**
 * Sets an item in LocalStorage with automatic JSON stringification
 */

export const setItemsInLocalStorage = (key, value) => {
  if (!key || value === undefined || value === null) {
    return console.error("Cannot store in LS: Key or Value is missing");
  }

  // If it's an object/array, stringify it.

  const valueToStore =
    typeof value !== "string" ? JSON.stringify(value) : value;

  localStorage.setItem(key, valueToStore);
};

/**
 * Retrieves an item from LocalStorage
 */

export const getItemFromLocalStorage = (key) => {
  if (!key) {
    console.error(`Cannot get value from LS: No key provided`);
    return null;
  }
  return localStorage.getItem(key);
};

/**
 * Removes an item from LocalStorage
 */

export const removeItemFromLocalStorage = (key) => {
  if (!key) {
    return console.error(`Cannot remove item from LS: No key provided`);
  }
  localStorage.removeItem(key);
};
