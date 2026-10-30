import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFormService } from '../../services/app-form.service';
import { Country } from '../../services/models/country.model';
import { State } from '../../services/models/state.model';
import { AddressFieldset } from '../../components/address-fieldset/address-fieldset';
import { FieldRow } from '../../components/field-row/field-row';
import { createAddressForm } from '../../common/address-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { notOnlyWhitespace, PATTERNS } from '../../common/validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { toOrderDto } from '../../common/purchase-mapper';
import { BrowserStorage } from '../../core/browser-storage.service';
import { isCustomerEmail } from '../../shared/utils/common.util';
import { PATHS } from '../../common/app-paths';
import { PageLayout } from '../../components/page-layout/page-layout';
import { StripePayment } from '../../components/stripe-payment/stripe-payment';
import { firstValueFrom } from 'rxjs';
import { OrderSummary } from '../../components/order-summary/order-summary';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, PageLayout, FieldRow, AddressFieldset, OrderSummary, StripePayment],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',

})
export class Checkout implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router: Router = inject(Router);
  private readonly appFormService: AppFormService = inject(AppFormService);
  private readonly browserStorage: BrowserStorage = inject(BrowserStorage);
  private readonly cartService: CartService = inject(CartService);
  private readonly checkoutService: CheckoutService = inject(CheckoutService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly payment = viewChild.required(StripePayment);

  protected readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly countries = signal<Country[]>([]);
  readonly shippingAddressStates = signal<State[]>([]);
  readonly billingAddressStates = signal<State[]>([]);
  readonly PATHS = PATHS;
  
  protected readonly form = this.fb.group({
      customer: this.fb.group({
        firstName: ['', [ Validators.required, Validators.minLength(2), notOnlyWhitespace ]],
        lastName: ['', [ Validators.required, Validators.minLength(2), notOnlyWhitespace ]],
        email: ['', [ Validators.required, Validators.email, Validators.pattern(PATTERNS.email) ]],
      }),
      shippingAddress: createAddressForm(this.fb),
      billingAddress: createAddressForm(this.fb),
    });

  ngOnInit(): void {
    this.initializeUserEmail();
    this.loadCountries();
  }

  initializeUserEmail(): void {
    const userEmail: string = this.browserStorage.read('userEmail', '', isCustomerEmail);
    if (userEmail) {
      this.form.controls.customer.controls.email.setValue(userEmail);
    }  
  }

  loadCountries(): void {
    this.appFormService.getCountries()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(countries => this.countries.set(countries));
  }

  getStates(formGroupName: string): void {
    const formGroup: AbstractControl | null = this.form.get(formGroupName);
    const countryCode: string = formGroup?.value.country.code;

    this.appFormService.getStates(countryCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(states => {
      formGroupName === 'shippingAddress' ? this.shippingAddressStates.set(states) : this.billingAddressStates.set(states);
      formGroup?.get('state')?.setValue(states[0])
    });
  }

  copyShippingAddressToBillingAddress(event: any){
    if (event.target.checked) {
      this.form.controls.billingAddress.setValue(this.form.controls.shippingAddress.getRawValue());
      this.billingAddressStates.set(this.shippingAddressStates());
    } else {
      this.form.controls.billingAddress.reset();
      this.billingAddressStates.set([]);
    }
  }

  resetData(): void {
    this.cartService.clearCart(); // clear cart data
    this.form.reset(); // reset form data
    this.router.navigateByUrl(this.PATHS.productList); // navigate back to product-list page
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      // Charge first — no point creating an order that was never paid for.
      const charged = await this.payment().confirm();
      if (!charged) return;

      const order = toOrderDto(this.form.getRawValue(), this.cartService.cartItems, this.cartService.totalQuantity.getValue(), this.cartService.totalPrice.getValue());
      const { orderTrackingNumber } = await firstValueFrom(this.checkoutService.placeOrder(order));

      alert(`Your Order has been received.\n Order Tracking number: ${orderTrackingNumber}`);
      this.resetData();
    } catch {
      this.error.set('Payment went through but we could not save your order. Contact support with your email.');
    } finally {
      this.submitting.set(false);
      this.error.set(null);
    }
  }

}