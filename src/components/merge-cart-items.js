// @ts-check
/**
 * @typedef {import("./Checkout.types").Product} Product
 */

/**
 * @param {Product[]} currentCartItems 
 * @param {Product[]} newProducts 
 * @returns {Product[]} - all products
 */
export function mergeCartItems(
  currentCartItems,
  newProducts,
) {
  const cartMap = currentCartItems.reduce((acc, item) => {
    if (!item || !item.id) return acc;
    const quantity = typeof item.quantity === "number" ? item.quantity : 1;
    acc[item.id] = { ...item, quantity };
    return acc;
  }, {});

  newProducts.forEach((product) => {
    if (!product || !product.id) return;
    if (cartMap[product.id]) {
      cartMap[product.id].quantity += 1;
    } else {
      cartMap[product.id] = { ...product, quantity: 1 };
    }
  });

  return Object.values(cartMap);
}