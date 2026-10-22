import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFormService } from '../../services/app-form.service';
import { Country } from '../../services/models/country.model';
import { State } from '../../services/models/state.model';
import { AddressFieldset } from '../../components/address-fieldset/address-fieldset';
import { FieldRow } from '../../components/field-row/field-row';
import { createAddressForm } from '../../common/address-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { notOnlyWhitespace, PATTERNS } from '../../common/validators';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe, FieldRow, AddressFieldset],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',

})
export class Checkout implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly appFormService: AppFormService = inject(AppFormService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal(false);
  protected readonly totalPrice = signal<number>(0);
  protected readonly totalQuantity = signal<number>(0);

  protected readonly creditCardMonths = signal<number[]>([]);
  protected readonly creditCardYears = signal<number[]>([]);

  readonly countries = signal<Country[]>([]);
  readonly shippingAddressStates = signal<State[]>([]);
  readonly billingAddressStates = signal<State[]>([]);
  

protected readonly form = this.fb.group({
  customer: this.fb.group({
    firstName: ['', [ Validators.required, Validators.minLength(2), notOnlyWhitespace ]],
    lastName: ['', [ Validators.required, Validators.minLength(2), notOnlyWhitespace ]],
    email: ['', [ Validators.required, Validators.email, Validators.pattern(PATTERNS.email) ]],
  }),
  shippingAddress: createAddressForm(this.fb),
  billingAddress: createAddressForm(this.fb),
  creditCard: this.fb.group({
    cardType: ['VISA', Validators.required],
    nameOnCard: ['', [ Validators.required, Validators.minLength(2), notOnlyWhitespace ]],
    cardNumber: ['', [ Validators.required, Validators.pattern(PATTERNS.creditCardNumber) ]],
    securityCode: ['', [ Validators.required, Validators.pattern(PATTERNS.securityCode) ]],
    expirationMonth: [0, Validators.required],
    expirationYear: [0, Validators.required],
  }),
});

  ngOnInit(): void {
    this.getCreditCardMonths();
    this.getCreditCardYears();
    this.loadCountries();
    this.monitorExpirationYear();
  }

  monitorExpirationYear(): void {
    this.form.controls.creditCard.controls.expirationYear.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(year => {
        this.handleMonthsAndYears(Number(year))
      });
  }

  handleMonthsAndYears(expirationYear: number): void {
    const currentYear: number = new Date().getFullYear();
    const startMonth: number = currentYear === expirationYear ? new Date().getMonth() + 1 : 1;
    this.getCreditCardMonths(startMonth)

  }

  getCreditCardMonths(startMonth = 1): void {
    this.appFormService.getCreditCardMonths(startMonth)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(months => this.creditCardMonths.set(months));
  }

  getCreditCardYears(): void {
    this.appFormService.getCreditCardYears()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(years => this.creditCardYears.set(years));
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

  protected onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // reveal every error at once
      return;
    }
    const value = this.form.getRawValue();   // fully typed, no nulls
    console.log(value);
  }
}