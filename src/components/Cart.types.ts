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
export interface CartProps {
  allProducts: Product[];
  locale: string
}

export interface ProductImage {
  url: string;
  alt: string;
}

export type UpdateCartDetail = {
  product: Product;
  price: number;
};