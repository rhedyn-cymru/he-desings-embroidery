import { describe, it, expect } from "vitest"

import { mergeCartItems } from "./merge-cart-items"

describe("mergeCartItems", () => {
  it("returns itemsToMerge when baseProducts is empty", () => {
    const itemsToMerge = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 2,
        description: "A nice poster",
      },
    ];

    const result = mergeCartItems([], itemsToMerge);

    expect(result).toBe(itemsToMerge);
  });

  it("increments quantity when item already exists", () => {
    const baseProducts = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 2,
        description: "A nice poster",
      },
    ];
    const itemsToMerge = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 5,
        description: "A nice poster",
      },
    ];

    const result = mergeCartItems(baseProducts, itemsToMerge);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "p-1", quantity: 3 });
  });

  it("adds new items that do not exist in baseProducts", () => {
    const baseProducts = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 1,
        description: "A nice poster",
      },
    ];
    const itemsToMerge = [
      {
        id: "p-2",
        title: "Sticker",
        price: 4,
        images: [{ url: "https://example.com/2.jpg", alt: "Sticker" }],
        quantity: 1,
        description: "A cool sticker",
      },
    ];

    const result = mergeCartItems(baseProducts, itemsToMerge);

    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({ id: "p-2", quantity: 1 });
  });

  it("merges a mix of existing and new items", () => {
    const baseProducts = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 1,
        description: "A nice poster",
      },
      {
        id: "p-3",
        title: "Mug",
        price: 12,
        images: [{ url: "https://example.com/3.jpg", alt: "Mug" }],
        quantity: 2,
        description: "A sturdy mug",
      },
    ];
    const itemsToMerge = [
      {
        id: "p-1",
        title: "Poster",
        price: 10,
        images: [{ url: "https://example.com/1.jpg", alt: "Poster" }],
        quantity: 1,
        description: "A nice poster",
      },
      {
        id: "p-2",
        title: "Sticker",
        price: 4,
        images: [{ url: "https://example.com/2.jpg", alt: "Sticker" }],
        quantity: 1,
        description: "A cool sticker",
      },
    ];

    const result = mergeCartItems(baseProducts, itemsToMerge);

    expect(result).toHaveLength(3);
    expect(result.find(item => item.id === "p-1")?.quantity).toBe(2);
    expect(result.find(item => item.id === "p-2")?.quantity).toBe(1);
    expect(result.find(item => item.id === "p-3")?.quantity).toBe(2);
  });
})