import React, { useEffect, useState } from "react";
import type {
  CheckoutProps,
  CompleteCartItem,
  CartItem,
  Product,
} from "./Checkout.types";

import {
  UPDATE_CART,
  CART_TOTAL,
  CART_ITEMS,
  CLEAR_CART,
} from "../cart-actions";

const Checkout = ({ products }: CheckoutProps) => {
  const [cartItems, setCartItems] = useState<CompleteCartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  function mergeCartItemsWithNewProducts(
    currentCartItems: CartItem[],
    newProducts: Product[],
  ): CompleteCartItem[] {
    return Object.values(
      currentCartItems.reduce(
        (acc, cartItem) => {
          const product = newProducts.find((p) => p.id === cartItem.sku);
          if (!product) return acc;

          if (acc[cartItem.sku]) {
            acc[cartItem.sku].quantity++;
          } else {
            acc[cartItem.sku] = { ...product, quantity: 1 };
          }
          return acc;
        },
        {} as Record<string, CompleteCartItem>,
      ),
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


  function updateMiniCart(products) {
    window.dispatchEvent(
      new CustomEvent(UPDATE_CART, {
        detail: {
          items: { sku: product.sku },
          price: product.price,
        },
      }),
    );
  }

  /*
   *
   * INTERNAL FUNCTIONS 
   *
  */
  function clearCart() {
    setCartItems([]);
    window.dispatchEvent(new CustomEvent(CLEAR_CART));
  }
  function removeItem(cartItem: CartItem) {
    const removedTotal = cartItem.price * cartItem.quantity;
    setCartTotal((prevCartTotal) => prevCartTotal - removedTotal);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItem.id));
  }
  function increaseQuantity(cartItem: CartItem) {
    const increasedTotal = cartItem.price;
    setCartTotal((prevCartTotal) => prevCartTotal + increasedTotal);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }
  function decreaseQuantity(cartItem: CartItem) {
    const decreasedTotal = cartItem.price;
    setCartTotal((prevCartTotal) => prevCartTotal - decreasedTotal);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItem.id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  }

  useEffect(() => {
    const currentCartTotal = getLSCartTotal();
    setCartTotal(currentCartTotal);

    const currentCartItems = getLSCartItems();
    if (!currentCartItems || !currentCartItems.length) return;
    const completeCartItems = mergeCartItemsWithNewProducts(
      currentCartItems,
      products,
    );
    setCartItems(completeCartItems);
  }, []);

  useEffect(() => {

  }, [setCartTotal, setCartItems])

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
          {cartItem.images?.length ? (
            <img src={cartItem.images[0].url} alt={cartItem.images[0].alt} />
          ) : null}
          <div>
            <h3 className="text-lg">{cartItem.title}</h3>
            <p className="mb-2">{cartItem.description}</p>
            <div>price: &pound;{cartItem.price}</div>
            <div>Total cost: &pound;{cartItem.price * cartItem.quantity}</div>

            <div className="flex gap-2 mt-4 items-center">
              <button
                onClick={() => decreaseQuantity(cartItem)}
                className="btn btn-sm btn-outline"
              >
                −
              </button>
              {cartItem.quantity}
              <button
                onClick={() => increaseQuantity(cartItem)}
                className="btn btn-sm btn-outline"
              >
                +
              </button>
              <button
                onClick={() => removeItem(cartItem)}
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
