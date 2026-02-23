// @ts-check
/**
 * @typedef {import("../Cart.types").Product} Product
 */

/**
 * @param {Product[] | []} baseProducts - initial products in the cart
 * @param {Product[]} [itemsToMerge] - items to merge into the base products
 * @returns {Product[]} - all products
 */
export function mergeCartItems(baseProducts, itemsToMerge) {
  if(!itemsToMerge) return baseProducts;

  if (!baseProducts.length) {
    return itemsToMerge;
  }

  return itemsToMerge.reduce((acc, item) => {
    const existingItem = acc.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      return acc.map(cartItem =>
        cartItem.id === item.id
          ? { 
              ...cartItem, 
              quantity: (cartItem.quantity || 1) + 1 
            }
          : cartItem
      );
    }
    return [...acc, item];
  }, baseProducts);
}