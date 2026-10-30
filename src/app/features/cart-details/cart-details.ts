import { Component, inject, OnInit, signal } from '@angular/core';
import { CartItem } from '../../services/models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../common/app-paths';
import { PageLayout } from '../../components/page-layout/page-layout';
import { OrderSummary } from '../../components/order-summary/order-summary';

@Component({
  imports: [CurrencyPipe, RouterLink, PageLayout, OrderSummary],
  selector: 'app-cart-details',
  styleUrl: './cart-details.scss',
  templateUrl: './cart-details.html',
})
export class CartDetails implements OnInit {

  private readonly cartService: CartService = inject(CartService);

  readonly PATHS = PATHS;
  cartItems = signal<CartItem[]>([]);

  ngOnInit() {
    this.cartItems.set(this.cartService.cartItems); // load Cart Items
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
