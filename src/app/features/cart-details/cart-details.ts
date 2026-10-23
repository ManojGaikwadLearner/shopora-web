import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CartItem } from '../../services/models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../common/app-paths';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-details',
  styleUrl: './cart-details.scss',
  templateUrl: './cart-details.html',
})
export class CartDetails implements OnInit {

  private readonly cartService: CartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  readonly PATHS = PATHS;
  cartItems = signal<CartItem[]>([]);
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);

  ngOnInit() {
    this.listCartDetails();
  }

  listCartDetails(): void {
    this.cartItems.set(this.cartService.cartItems);

    this.cartService.totalPrice.asObservable()
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(totalPrice => this.totalPrice.set(totalPrice));
    this.cartService.totalQuantity.asObservable()
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(totalQuantity => this.totalQuantity.set(totalQuantity));

    this.cartService.computeCartTotals();
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
