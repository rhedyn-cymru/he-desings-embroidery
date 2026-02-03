import React, { useEffect, useState } from "react";
import type { CheckoutProps, CompleteCartItem, CartItem, Product } from "./Checkout.types";

const Checkout = ({ products }: CheckoutProps) => {
  const [cartItems, setCartItems] = useState<CompleteCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const CART_ITEMS = "cartitems";
  const CART_TOTAL = "carttotal";

  function mergeCartItemsWithProducts(
    currentCartItems: CartItem[],
    products: Product[],
  ): CompleteCartItem[] {
    return Object.values(
      currentCartItems.reduce((acc, cartItem) => {
        const product = products.find((p) => p.id === cartItem.sku);
        if (!product) return acc;

        if (acc[cartItem.sku]) {
          acc[cartItem.sku].quantity++;
        } else {
          acc[cartItem.sku] = { ...product, quantity: 1 };
        }
        return acc;
      }, {} as Record<string, CompleteCartItem>),
    );
  }

  function getLSCartItems() {
    const cartItemsRaw = localStorage.getItem(CART_ITEMS);
    try {
      return cartItemsRaw ? JSON.parse(cartItemsRaw) : [];
    } catch {
      return [];
    }
  }

  function getLSCartTotal() {
    const cartTotalRaw = localStorage.getItem(CART_TOTAL);
    const parsed = cartTotalRaw ? JSON.parse(cartTotalRaw) : 0;
    return Number(parsed) || 0;
  }

  function updateLSCartItems(items) {
    localStorage.setItem(CART_ITEMS, JSON.stringify(items));
  }

  function addProductToMiniToCart(product) {
    window.dispatchEvent(
      new CustomEvent("updatecart", {
        detail: {
          item: { sku: product.sku },
          price: product.price,
        },
      }),
    );
  }

  function increaseQuantity(sku: string) {
    const updated = cartItems.map(item => 
      item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  }

  function decreaseQuantity(sku: string) {
    const updated = cartItems
      .map(item => 
        item.sku === sku && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
      .filter(item => item.quantity > 0);
    setCartItems(updated);
  }

  function removeItem(sku: string) {
    const updated = cartItems.filter(item => item.sku !== sku);
    setCartItems(updated);
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem(CART_ITEMS);
    localStorage.removeItem(CART_TOTAL);
  }

  useEffect(() => {
    const currentCartTotal = getLSCartTotal();
    setCartTotal(currentCartTotal);

    const currentCartItems = getLSCartItems();
    if (!currentCartItems || !currentCartItems.length) return;
    const completeCartItems = mergeCartItemsWithProducts(currentCartItems, products);
    setCartItems(completeCartItems);
  }, []);

  if (!cartItems.length) {
    return (
      <div>
        <p className="mb-4">There are no items in your cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <h2>Your Cart</h2>
        <button 
          onClick={clearCart}
          className="btn btn-sm btn-outline btn-error"
        >
          Clear Cart
        </button>
      </div>
      {cartItems.map((cartItem) => (
        <article className="grid grid-cols-2 gap-4 mb-4 p-4" key={cartItem.id}>
          <img src={cartItem.images[0].url} alt={cartItem.images[0].alt} />
          <div>
            <h3 className="text-lg">{cartItem.title}</h3>
            <p className="mb-2">{cartItem.description}</p>
            <div>price: &pound;{cartItem.price}</div>
            <div>Total cost: &pound;{cartItem.price * cartItem.quantity}</div>

            <div className="flex gap-2 mt-4 items-center">
              <button 
                onClick={() => decreaseQuantity(cartItem.sku)}
                className="btn btn-sm btn-outline"
              >
                −
              </button>
              {cartItem.quantity}
              <button 
                onClick={() => increaseQuantity(cartItem.sku)}
                className="btn btn-sm btn-outline"
              >
                +
              </button>
              <button 
                onClick={() => removeItem(cartItem.sku)}
                className="btn btn-sm btn-outline btn-error"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Checkout;
