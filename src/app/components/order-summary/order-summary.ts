import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-order-summary',
  styleUrl: './order-summary.scss',
  templateUrl: './order-summary.html',
})
export class OrderSummary {
  readonly shipping = input(0);
  readonly currency = input('USD');

  protected readonly cart = inject(CartService);

  protected readonly shippingLabel = computed(() => (this.shipping() === 0 ? 'FREE' : `${this.shipping()}`));
  protected readonly totalQuantity = computed(() => this.cart.totalQuantity.getValue());
  protected readonly totalPrice = computed(() => this.cart.totalPrice.getValue() + this.shipping());
}
