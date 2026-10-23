import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../common/app-paths';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-status',
  styleUrl: './cart-status.scss',
  templateUrl: './cart-status.html',
})
export class CartStatus implements OnInit {

  cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);


  readonly PATHS = PATHS;
  protected readonly cartTotal = signal(0);
  protected readonly cartCount = signal(0);

  ngOnInit() {
    this.cartService.totalPrice.asObservable()
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(updatedTotalPrice => this.cartTotal.set(updatedTotalPrice));
    this.cartService.totalQuantity.asObservable().pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(updatedTotalQuantity => this.cartCount.set(updatedTotalQuantity));
  }
}
