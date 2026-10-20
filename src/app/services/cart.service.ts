import { Service } from '@angular/core';
import { CartItem } from './models/cart-item.model';
import { Subject } from 'rxjs';

@Service()
export class CartService {
    cartItems: CartItem[] = [];

    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

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
    }

    removeItem(theCartItem: CartItem): void {
        const itemIndex = this.cartItems.findIndex(item => item.id === theCartItem.id);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }
}
