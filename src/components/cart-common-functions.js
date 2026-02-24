import { Temporal } from "@js-temporal/polyfill";

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
  const CURRENT_VERSION = import.meta.env.PUBLIC_APP_VERSION || "000000";
  const SAVED_VERSION = localStorage.getItem('app_version');

  console.log(CURRENT_VERSION, SAVED_VERSION)

  if (!SAVED_VERSION || SAVED_VERSION !== CURRENT_VERSION) {
    localStorage.setItem('app_version', CURRENT_VERSION);  
    localStorage.setItem(CART_ITEMS, JSON.stringify({
      timestamp: Temporal.Now.instant().epochMilliseconds,
      items: []
    }));
    return;
  }
}

/**
 * 
 * @returns {Product[] | []}
 */
function getCartItems() {
  const CURRENT_VERSION = import.meta.env.PUBLIC_APP_VERSION || "000000";
  const SAVED_VERSION = localStorage.getItem('app_version');

  if (!SAVED_VERSION || SAVED_VERSION !== CURRENT_VERSION) {
    setStorageDefaults();
    return [];
  }

  const cartItemsRaw = localStorage.getItem(CART_ITEMS);
  if (!cartItemsRaw) {
    setStorageDefaults();
    return [];
  }

  try {
    const parsedCart = JSON.parse(cartItemsRaw);
    return Array.isArray(parsedCart?.items) ? parsedCart.items : [];

  } catch {
    setStorageDefaults();
    return [];
  }
}

/**
 * 
 * @param {Product[]} items
 * @returns {number} 
 */
function deriveCartTotal(cartItems) {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  const total = cartItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
  return total;
}

/**
 * 
 * @param {Product[]} items
 * @returns {number} 
 */
function deriveCartItemQuantity(cartItems) {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  const total = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  return total;
}

/**
 * 
 * @param {Product[]} items
 * @returns {void} 
 */
function setCartItems(items) {
  localStorage.setItem(CART_ITEMS, JSON.stringify({
    items,
    timestamp: Temporal.Now.instant().epochMilliseconds
  }));
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

function calculateShippingCost(itemsCount) {
  const costs = [
    {
      itemCount: 1,
      shippingCost: 4
    },
    {
      itemCount: 4,
      shippingCost: 8
    },
    {
      itemCount: 12,
      shippingCost: 14
    },
  ]

  const applicableTier = costs.reduce((selected, tier) => {
    if (tier.itemCount <= itemsCount) {
      return tier.itemCount > (selected?.itemCount || 0) ? tier : selected;
    }
    return selected;
  }, null);

  return applicableTier?.shippingCost || costs[0].shippingCost;
}

export {
  setStorageDefaults,
  deriveCartItemQuantity,
  getCartItems,
  setCartItems,
  deriveCartTotal,
  formatAsGbp,
  calculateShippingCost
}