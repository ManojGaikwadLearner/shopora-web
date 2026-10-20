import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-cart-status',
  styleUrl: './cart-status.scss',
  templateUrl: './cart-status.html',
})
export class CartStatus {
  protected readonly cartTotal = signal(19.22);
  protected readonly cartCount = signal(2);
}
