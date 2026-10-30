import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDto, PurchaseResponse } from '../common/purchase';
import { PaymentInfo } from './models/payment-info.model';

@Service()
export class CheckoutService {
    httpClient: HttpClient = inject(HttpClient);

    private baseUrl: string = '/api/checkout';
    private purchaseUrl: string = `${this.baseUrl}/purchase`;
    private paymentIntentUrl: string = `${this.baseUrl}/payment-intent`;

    placeOrder(purchase: PurchaseDto): Observable<PurchaseResponse> {
        return this.httpClient.post<PurchaseResponse>(this.purchaseUrl, purchase);
    }

    createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
        return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
    }
}
