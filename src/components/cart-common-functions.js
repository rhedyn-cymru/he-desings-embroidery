export const CART_ITEMS = "cartitems";
export const CART_TOTAL = "carttotal";
export const CLEAR_CART = "clearcart";
export const REPLACE_CART = "replacecart";
export const UPDATE_CART = "updatecart";
/**
   *
   * Cart receives events and updates the cart
   *
   */
function setStorageDefaults() {
  if (!localStorage.getItem(CART_ITEMS)) {
    localStorage.setItem(CART_ITEMS, JSON.stringify([]));
  }
}

function getCartItems() {
  const cartItemsRaw = localStorage.getItem(CART_ITEMS);
  try {
    return cartItemsRaw ? JSON.parse(cartItemsRaw) : [];
  } catch {
    return [];
  }
}

/**
 * 
 * @param {Product[]} items
 * @returns {number} 
 */
function deriveCartTotal(cartItems) {
  const total = cartItems.reduce((sum, cartItem) =>sum + (cartItem.price * cartItem.quantity), 0)
  return total;
}

/**
 * 
 * @param {Product[]} items
 * @returns {number} 
 */
function deriveCartItemQuantity(cartItems) {
  return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
}

/**
 * 
 * @param {Product[]} items
 * @returns {void} 
 */
function setCartItems(items) {
  localStorage.setItem(CART_ITEMS, JSON.stringify(items));
}

/**
 * 
 */
function formatAsGbp(cost) {
      const costCurrency = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(cost);

    return costCurrency;
}

export {
  setStorageDefaults,
  deriveCartItemQuantity,
  getCartItems,
  setCartItems,
  deriveCartTotal,
  formatAsGbp
}