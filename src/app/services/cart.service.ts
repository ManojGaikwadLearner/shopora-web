import { inject, Service } from '@angular/core';
import { CartItem } from './models/cart-item.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { BrowserStorage } from '../core/browser-storage.service';

const isCart = (v: unknown): v is CartItem[] => Array.isArray(v) && v.every(i => typeof i?.id === 'number');

@Service()
export class CartService {

    browserStorage: BrowserStorage = inject(BrowserStorage);

    cartItems: CartItem[] = [];

    totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor() {
        let data = this.browserStorage.read('cartItems', [], isCart);
        if (data != null) {
            this.cartItems = data;
            this.computeCartTotals();
        }
    }

    addToCart(theCartItem: CartItem) {
        // Check if we already have the item in our cart
        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem | undefined = undefined;
        
        if (this.cartItems.length > 0) {
            // Find the item in the cart based on item id
            existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
            // Check if we found it
            alreadyExistsInCart = (existingCartItem != undefined);
        }

        if (alreadyExistsInCart && existingCartItem) {
            // Update the quantity
            existingCartItem.quantity++;
        } else {
            // Add the new item to the cart
            this.cartItems.push(theCartItem);
        }

        // Calculate the new total price and quantity
        this.computeCartTotals();
    }

    persistCartItems(): void {
        this.browserStorage.write('cartItems', this.cartItems)
    }

    decrementQuantity(theCartItem: CartItem): void {
        theCartItem.quantity--;
        if (theCartItem.quantity === 0) {
            this.removeItem(theCartItem)
        } else {
            this.computeCartTotals();
        }
    }

    computeCartTotals(): void {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
            totalQuantityValue += currentCartItem.quantity;
        }

        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        this.persistCartItems();
    }

    removeItem(theCartItem: CartItem): void {
        const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }

    clearCart(): void {
        this.cartItems = [];
        this.totalPrice.next(0);
        this.totalQuantity.next(0);
    }
}
