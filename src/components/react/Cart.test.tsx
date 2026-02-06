// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import type { Product } from "../Cart.types";
import { CART_ITEMS, CART_TOTAL, CLEAR_CART, UPDATE_CART } from "../cart-common-functions";
import Cart from "./Cart";

vi.mock("../../i18n/utils", () => ({
  useTranslations: () => (key: string) => key,
}));

const product: Product = {
  id: "p1",
  title: "Test Product",
  price: 10,
  images: [{ url: "/test.png", alt: "test" }],
  quantity: 1,
  description: "Product description",
};

function setCart(items: Product[]) {
  localStorage.setItem(CART_ITEMS, JSON.stringify(items));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  localStorage.setItem(CART_TOTAL, `${total}`);
}

describe("<Cart />", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
    localStorage.clear();
  });

  it("renders an empty state when cart is empty", () => {
    render(<Cart allProducts={[]} locale="en" />);

    expect(
      screen.getByText(/There are no items in your cart\s*\./i),
    ).not.toBeNull();
    const link = screen.getByRole("link", { name: "View products" });
    expect(link.getAttribute("href")).toBe("/en/products/");
  });

  it("renders cart items from localStorage", () => {
    setCart([product]);
    render(<Cart allProducts={[product]} locale="en" />);

    expect(screen.getByRole("heading", { name: product.title })).not.toBeNull();
    expect(screen.getByText(product.description)).not.toBeNull();
    expect(screen.getByText("price: £10")).not.toBeNull();
    expect(screen.getByText("Total cost: £10")).not.toBeNull();
  });

  it("increases quantity when + is clicked", () => {
    setCart([product]);
    render(<Cart allProducts={[product]} locale="en" />);

    const increaseButton = screen.getAllByRole("button", { name: "+" })[0];
    const controls = increaseButton.parentElement as HTMLElement;

    expect(within(controls).getByText("1")).not.toBeNull();
    fireEvent.click(increaseButton);
    expect(within(controls).getByText("2")).not.toBeNull();
  });

  it("decreases quantity when − is clicked", () => {
    setCart([{ ...product, quantity: 2 }]);
    render(<Cart allProducts={[product]} locale="en" />);

    const decreaseButton = screen.getByRole("button", { name: "−" });
    const controls = decreaseButton.parentElement as HTMLElement;

    expect(within(controls).getByText("2")).not.toBeNull();
    fireEvent.click(decreaseButton);
    expect(within(controls).getByText("1")).not.toBeNull();
  });

  it("removes item when Remove is clicked", () => {
    setCart([product]);
    render(<Cart allProducts={[product]} locale="en" />);

    const removeButton = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(removeButton);

    expect(
      screen.getByText(/There are no items in your cart\s*\./i),
    ).not.toBeNull();
  });

  it("dispatches CLEAR_CART when Clear Cart is clicked", () => {
    setCart([product]);
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    render(<Cart allProducts={[product]} locale="en" />);

    const clearButton = screen.getByRole("button", { name: "Clear Cart" });
    fireEvent.click(clearButton);

    const hadClearEvent = dispatchSpy.mock.calls.some(
      ([event]) => (event as Event).type === CLEAR_CART,
    );
    expect(hadClearEvent).toBe(true);
  });

  it("handles UPDATE_CART custom event", () => {
    setCart([product]);
    render(<Cart allProducts={[product]} locale="en" />);

    const increaseButton = screen.getAllByRole("button", { name: "+" })[0];
    const controls = increaseButton.parentElement as HTMLElement;

    fireEvent(
      window,
      new CustomEvent(UPDATE_CART, {
        detail: { product, price: product.price },
      }),
    );
    
    expect(within(controls).getByText("2")).not.toBeNull();
  });
});