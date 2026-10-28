import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';
import { Order } from '../../services/models/order-history.model';
import { BrowserStorage } from '../../core/browser-storage.service';
import { isCustomerEmail } from '../../shared/utils/common.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe],
  selector: 'app-order-history',
  styleUrl: './order-history.scss',
  templateUrl: './order-history.html',
})
export class OrderHistory implements OnInit {

  private readonly browserStorage: BrowserStorage = inject(BrowserStorage);
  private readonly orderHistoryService = inject(OrderHistoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly orderHistoryList = signal<Order[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    const customerEmail: string = this.browserStorage.read('userEmail', '', isCustomerEmail);
    this.orderHistoryService.getOrderHistory(customerEmail).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: orders => {
          this.orderHistoryList.set(orders);
        },
        error: err => {
          this.error.set('Could not load order history.');
        }
      })
  }

}
