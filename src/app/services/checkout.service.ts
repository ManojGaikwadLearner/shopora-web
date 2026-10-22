import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDto, PurchaseResponse } from '../common/purchase';

@Service()
export class CheckoutService {
    httpClient: HttpClient = inject(HttpClient);

    private purchaseUrl: string = '/api/checkout/purchase';

    placeOrder(purchase: PurchaseDto): Observable<PurchaseResponse> {
        return this.httpClient.post<PurchaseResponse>(this.purchaseUrl, purchase)
    }
}
