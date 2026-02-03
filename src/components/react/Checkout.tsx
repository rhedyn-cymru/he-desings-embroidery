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
      {cartItems.map((cartItem) => (
        <article className="grid grid-cols-2 gap-4" key={cartItem.id}>
          <img src={cartItem.images[0].url} alt={cartItem.images[0].alt} />
          <div>
            <div className="flex gap-2 items-center">
              <h3 className="text-lg">{cartItem.title}</h3>
              <small className="badge badge-primary">
                {" "}
                x {cartItem.quantity}
              </small>
            </div>
            <p className="mb-2">{cartItem.description}</p>
            <div>price: &pound;{cartItem.price}</div>
            <div>Total cost: &pound;{cartItem.price * cartItem.quantity}</div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Checkout;
