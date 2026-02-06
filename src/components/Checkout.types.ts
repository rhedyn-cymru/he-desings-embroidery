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
}

export interface CompleteCartItem extends Product {
  quantity: number;
}

export interface CheckoutProps {
  allProducts: Product[];
  locale: string
  t: (key: string) => string
}
