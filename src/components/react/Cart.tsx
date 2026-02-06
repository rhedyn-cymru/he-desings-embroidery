import React, { useEffect, useRef, useState } from "react";

import { useTranslations } from "../../i18n/utils";

import type {
  CartProps,
  Product,
  UpdateCartDetail
} from "../Cart.types";

import {
  REPLACE_CART,
  CLEAR_CART,
  UPDATE_CART,
  deriveCartItemQuantity,
  deriveCartTotal,
  getCartItems,
  setStorageDefaults,
  formatAsGbp
} from "../cart-common-functions"

const Cart = ({ locale }: CartProps) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const hasMountedRef = useRef(false);
  
  const t = useTranslations(locale)

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

  useEffect(() => {
    const onUpdateCart = (event: Event) => {
      handleUpdateCart(event as CustomEvent<UpdateCartDetail>);
    };

    window.addEventListener(UPDATE_CART, onUpdateCart);
    return () => {
      window.removeEventListener(UPDATE_CART, onUpdateCart);
    };
  }, []);

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
    setStorageDefaults()
    const initialCartItems = getCartItems();
    setCartItems(initialCartItems || []);
    const initialCartTotal = deriveCartTotal(initialCartItems);
    setCartTotal(initialCartTotal || 0);
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
    <div className="max-w-xl relative">
      <div className="mb-4 flex justify-end items-center sticky">
        <h2 className="mr-auto">
          {deriveCartItemQuantity(cartItems)}&nbsp;{t("items")}, total cost: {formatAsGbp(cartTotal)}
        </h2>
        <button
          onClick={clearCart}
          className="btn btn-sm btn-ghost btn-error"
          >
          {t("Clear Cart")}
        </button>
        <a
          href={`/${locale}/checkout/`}
          title="checkout now"
          className="btn btn-sm btn-primary"
        >
          {t("Checkout")}
        </a>
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
            <div>{t("price")}: {formatAsGbp(cartItem.price)}</div>
            <div>{t("Total cost")}: {formatAsGbp(cartItem.price * cartItem.quantity)}</div>

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

export default Cart;
