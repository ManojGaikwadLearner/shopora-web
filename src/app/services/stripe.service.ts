// services/stripe.service.ts
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentInfo } from './models/payment-info.model';

@Service()
export class StripeService {
  private readonly http = inject(HttpClient);
  private stripePromise?: Promise<Stripe | null>;
  private paymentIntentUrl: string = '/api/checkout/payment-intent';


  /** Loaded lazily so Stripe's script isn't fetched on pages that don't need it. */
  stripe(): Promise<Stripe | null> {
    this.stripePromise ??= loadStripe(environment.stripePublishableKey);
    return this.stripePromise;
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(this.paymentIntentUrl, paymentInfo),
    );
  }
}