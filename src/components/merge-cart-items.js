// @ts-check
/**
 * @typedef {import("./Checkout.types").Product} Product
 */

/**
 * @param {Product[]} newProducts 
 * @param {Product[]} currentCartItems 
 * @returns {Product[]} - all products
 */
export function mergeCartItems(newProducts, currentCartItems) {
  if (!newProducts.length) {
    return currentCartItems;
  }
  
  return currentCartItems.reduce((acc, item) => {
    const existingItem = acc.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      return acc;
    }
    return [...acc, item];
  }, newProducts);
}