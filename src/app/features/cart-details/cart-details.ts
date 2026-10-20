import { Component, inject, OnInit, signal } from '@angular/core';
import { CartItem } from '../../services/models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cart-details',
  styleUrl: './cart-details.scss',
  templateUrl: './cart-details.html',
})
export class CartDetails implements OnInit {

  private readonly cartService: CartService = inject(CartService);

  cartItems = signal<CartItem[]>([]);
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);

  ngOnInit() {
    this.listCartDetails()
  }

  listCartDetails(): void {
    this.cartItems.set(this.cartService.cartItems);

    this.cartService.totalPrice.asObservable().subscribe(totalPrice => this.totalPrice.set(totalPrice));
    this.cartService.totalQuantity.asObservable().subscribe(totalQuantity => this.totalQuantity.set(totalQuantity));

    this.cartService.computeCartTotals()
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem): void {
    this.cartService.decrementQuantity(cartItem);
  }

  removeItem(cartItem: CartItem): void {
    this.cartService.removeItem(cartItem);
  }

}
