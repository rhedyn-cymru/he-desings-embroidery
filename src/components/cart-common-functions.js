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
  localStorage.setItem(CART_ITEMS, JSON.stringify({ 
    timestamp: Temporal.Now.instant().epochMilliseconds , 
    items: [] 
  }));
}

function getCartItems() {
  const cartItemsRaw = localStorage.getItem(CART_ITEMS);
  if (!cartItemsRaw) {
    setStorageDefaults();
    return [];
  }
  try {
    const { items, timestamp } = JSON.parse(cartItemsRaw)
    const now = Temporal.Now.instant().epochMilliseconds;
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    if((now - timestamp) > twoHoursInMs) {
      setStorageDefaults()
      return []
    }
    return items;

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
  const total = cartItems.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.quantity), 0)
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