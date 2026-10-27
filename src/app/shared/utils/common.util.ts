import { CartItem } from "../../services/models/cart-item.model";
import { Product } from "../../services/models/product.model";

export const pageNumberFromUItoAPI = (pageNumber: number): number => pageNumber - 1;

export const pageNumberFromAPItoUI = (pageNumber: number): number => pageNumber + 1;

export const getCartItemFromProduct = (product: Product): CartItem => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      unitPrice: product.unitPrice,
      quantity: 1
    }
    return cartItem;
}

export const isCustomerEmail = (v: unknown): v is string =>
  v === null || (typeof v === 'string' && v.includes('@'));