export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  images: ProductImage[];
}

export interface CartItem {
  sku: string;
}

export interface CompleteCartItem extends Product {
  quantity: number;
}

export interface CheckoutProps {
  products: Product[];
}
