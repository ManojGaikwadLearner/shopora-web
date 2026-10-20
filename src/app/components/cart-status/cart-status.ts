import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cart-status',
  styleUrl: './cart-status.scss',
  templateUrl: './cart-status.html',
})
export class CartStatus {

  cartService = inject(CartService);

  protected readonly cartTotal = signal(0);
  protected readonly cartCount = signal(0);

  ngOnInit() {
    this.cartService.totalPrice.asObservable().subscribe(updatedTotalPrice => this.cartTotal.set(updatedTotalPrice));
    this.cartService.totalQuantity.asObservable().subscribe(updatedTotalQuantity => this.cartCount.set(updatedTotalQuantity));
  }
}
