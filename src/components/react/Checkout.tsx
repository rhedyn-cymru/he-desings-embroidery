import React, { useEffect, useState } from "react";

const Checkout = ({ products }) => {
  const [ cartItems, setCartItems ] = useState([]);
  const [ cartTotal, setCartTotal ] = useState(0);
  
  const CART_ITEMS = "cartitems";
  const CART_TOTAL = "carttotal";

  function getCartItems() {
    const cartItemsRaw = localStorage.getItem(CART_ITEMS);
    try {
      return cartItemsRaw ? JSON.parse(cartItemsRaw) : [];
    } catch {
      return [];
    }
  }

  function getCartTotal() {
    const cartTotalRaw = localStorage.getItem(CART_TOTAL);
    const parsed = cartTotalRaw ? JSON.parse(cartTotalRaw) : 0;
    return Number(parsed) || 0;
  }

  function updateCartItems(items) {
    localStorage.setItem(CART_ITEMS, JSON.stringify(items));
  }

  function addToCart(product) {
    setCartItems([
      ...cartItems,
      product
    ])
    
    window.dispatchEvent(new CustomEvent("updatecart", {
      detail: {
          item: { sku: product.sku },
          price: product.price,
        },
     }))
  }

  useEffect(() => {
    const currentCartItems = getCartItems()
    if(!currentCartItems || !currentCartItems.length) return;
    const completeCartItems = currentCartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.sku)
      return product ? { ...product, quantity: cartItem.quantity || 1 } : null
    }).filter(Boolean)
    setCartItems(completeCartItems)

    const currentCartTotal = getCartTotal();
    setCartTotal(currentCartTotal)
  }, [])

  if(!cartItems.length) {
    return (
      <div>
        <p className="mb-4">There are no items in your cart.</p>
      </div>
    )
  }

  return (
    <div>{cartItems.map(cartItem => (
      <article>
        <h3>{cartItem.title}</h3>
      </article>
    ))}</div>
  );
};

export default Checkout;
