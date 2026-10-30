import { afterNextRender, Component, DestroyRef, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { CartService } from '../../services/cart.service';
import { StripeService } from '../../services/stripe.service';
import { PaymentInfo } from '../../services/models/payment-info.model';

@Component({
  imports: [],
  selector: 'app-stripe-payment',
  styleUrl: './stripe-payment.scss',
  templateUrl: './stripe-payment.html',
})
export class StripePayment {
  /** Emitted once the card is charged, so the parent can persist the order. */
  readonly paid = output<void>();

  private readonly stripeService = inject(StripeService);
  private readonly cartService = inject(CartService);
  private readonly mount = viewChild.required<ElementRef<HTMLDivElement>>('mount');

  readonly ready = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly payError = signal<string | null>(null);

  private elements?: StripeElements;
  private element?: StripePaymentElement;

  constructor() {
    afterNextRender(() => void this.init());
    inject(DestroyRef).onDestroy(() => this.element?.destroy());
  }

  private async init(): Promise<void> {
    try {
      const stripe = await this.stripeService.stripe();
      if (!stripe) throw new Error('Stripe failed to load');

      const paymentIntent: PaymentInfo = {
        amount: this.cartService.totalPrice.getValue() * 100,
        currency: 'USD'
      }
      const response = await this.stripeService.createPaymentIntent(paymentIntent);

      this.elements = stripe.elements({
        clientSecret: response?.client_secret,
        appearance: { theme: 'stripe', variables: { colorPrimary: '#0a716c', borderRadius: '8px' } },
      });
      this.element = this.elements.create('payment');
      this.element.mount(this.mount().nativeElement);

      // Stripe's callbacks run outside Angular. The signal write is what
      // notifies change detection — required in a zoneless app.
      this.element.on('ready', () => this.ready.set(true));
    } catch (err) {
      console.error('Stripe init failed', err);
      this.loadError.set('Could not load the payment form. Refresh and try again.');
    }
  }

  /** Called by the parent after the rest of the form validates. Returns true if charged. */
  async confirm(): Promise<boolean> {
    const stripe = await this.stripeService.stripe();
    if (!stripe || !this.elements) return false;

    this.payError.set(null);
    const { error } = await stripe.confirmPayment({
      elements: this.elements,
      confirmParams: { return_url: `${window.location.origin}/order-confirmation` },
      redirect: 'if_required',
    });

    if (error) {
      this.payError.set(error.message ?? 'Payment failed. Try another card.');
      return false;
    }
    this.paid.emit();
    return true;
  }
}
