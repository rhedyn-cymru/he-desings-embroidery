export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: ProductImage[];
  quantity: number
  description: string
}

export interface CompleteCartItem extends Product {
  quantity: number;
}

export interface CheckoutProps {
  allProducts: Product[];
  locale: string
}

export type UpdateCartDetail = {
  product: Product;
  price: number;
};