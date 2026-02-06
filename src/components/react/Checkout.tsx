import React, { useEffect, useRef, useState } from "react";

import { useTranslations } from "../../i18n/utils";

import type {
  CheckoutProps,
  Product,
  UpdateCartDetail
} from "../Checkout.types";

import {
  REPLACE_CART,
  UPDATE_CART,
  CART_TOTAL,
  CART_ITEMS,
  CLEAR_CART,
} from "../cart-actions";


const Checkout = ({ locale }: CheckoutProps) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const hasMountedRef = useRef(false);
  
  const t = useTranslations(locale)

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
    const parsed = Number(cartTotalRaw || 0);
    parsed;
  }

  /*
   *
   * INTERNAL FUNCTIONS
   *
   */
  function clearCart() {
    setCartItems([]);
    setCartTotal(0);
    window.dispatchEvent(new CustomEvent(CLEAR_CART));
  }
  function removeItem(cartItem: Product) {
    const removedTotal = cartItem.price * cartItem.quantity;
    setCartTotal((prevCartTotal) => prevCartTotal - removedTotal);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== cartItem.id),
    );
    if(cartItems.length === 1) {
      window.dispatchEvent(new CustomEvent(CLEAR_CART))
    }
  }
  function increaseQuantity(cartItem: Product) {
    const increasedTotal = cartItem.price;
    setCartTotal((prevCartTotal) => prevCartTotal + increasedTotal);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }
  function decreaseQuantity(cartItem: Product) {
    if (cartItem.quantity <= 1) {
      // it's now zero so we should remove it from the cart
      removeItem(cartItem);
      return;
    }
    const decreasedTotal = cartItem.price;
    setCartTotal((prevCartTotal) => prevCartTotal - decreasedTotal);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  }
  function handleUpdateCart(event: CustomEvent<UpdateCartDetail>) {
    const { product, price } = event.detail || {};
    if (!product || price == null) return;

    increaseQuantity(product);
  };


  /*
   * Update minicart after initial load
   *
   */
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
    }
    if (hasMountedRef.current && cartItems.length) {
      window.dispatchEvent(
        new CustomEvent(REPLACE_CART, {
          detail: {
            items: cartItems,
            carttotal: cartTotal,
          },
        }),
      );
    }
  }, [cartTotal, cartItems]);

  /*
   * Update local state
   *
   */
  useEffect(() => {
    const initialCartTotal = getLSCartTotal();
    setCartTotal(initialCartTotal);

    const initialCartItems = getLSCartItems();

    setCartItems(initialCartItems);

    window.addEventListener(UPDATE_CART, handleUpdateCart as EventListener);
    return () => {
      window.removeEventListener(UPDATE_CART, handleUpdateCart as EventListener);
    };
  }, []);

  if (!cartItems.length) {
    return (
      <div>
        <p className="mb-4">{t("There are no items in your cart")}.</p>
        <a className="btn btn-primary mb-4" href={`/${locale}/products/`}>{t("View products")}</a>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-4 flex justify-between items-center">
        <h2>
          {cartItems.map(cartItem => cartItem.quantity)}&nbsp;{t("items")}, total cost: &pound;{cartTotal}
        </h2>
        <button
          onClick={clearCart}
          className="btn btn-sm btn-outline btn-error"
        >
          {t("Clear Cart")}
        </button>
      </div>
      <hr className="my-4"/>
      {cartItems.map((cartItem) => (
        <article
          className="grid grid-cols-2 gap-4 mb-4"
          key={cartItem.id}
        >
          {cartItem.images?.length ? (
            <img src={cartItem.images[0].url} alt={cartItem.images[0].alt} />
          ) : null}
          <div>
            <h3 className="text-lg">{cartItem.title}</h3>
            <p className="mb-2">{cartItem.description}</p>
            <div>{t("price")}: &pound;{cartItem.price}</div>
            <div>{t("Total cost")}: &pound;{cartItem.price * cartItem.quantity}</div>

            <div className="flex gap-2 mt-4 items-center">
              <button
                onClick={() => decreaseQuantity(cartItem)}
                className="btn btn-sm btn-outline"
              >
                −
              </button>
              <span aria-label={t("Quantity")}>{cartItem.quantity}</span>
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
                {t("Remove")}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Checkout;
