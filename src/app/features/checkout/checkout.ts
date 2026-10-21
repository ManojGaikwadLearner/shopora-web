import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFormService } from '../../services/app-form.service';
import { Country } from '../../services/models/country.model';
import { State } from '../../services/models/state.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',

})
export class Checkout implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appFormService: AppFormService = inject(AppFormService);

  protected readonly submitting = signal(false);
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);
  creditCardMonths = signal<number[]>([]);
  creditCardYears = signal<number[]>([]);
  readonly countries = signal<Country[]>([]);
  readonly shippingAddressStates = signal<State[]>([]);
  readonly billingAddressStates = signal<State[]>([]);
  

  protected readonly form = this.fb.nonNullable.group({
    customer: this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }),
    shippingAddress: this.fb.nonNullable.group({
      country: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    }),
    billingAddress: this.fb.nonNullable.group({
      country: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    }),
    creditCard: this.fb.nonNullable.group({
      cardType: [['Visa'], Validators.required],
      nameOnCard: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.maxLength(16)]],
      secuirtyCode: ['', [Validators.required, Validators.maxLength(3)]],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required],
    }),

  });

  ngOnInit(): void {
    this.getCreditCardMonths();
    this.getCreditCardYears();
    this.loadCountries();
  }

  getCreditCardMonths(startMonth = 1): void {
    this.appFormService.getCreditCardMonths(startMonth).subscribe(months => this.creditCardMonths.set(months));
  }

  getCreditCardYears(): void {
    this.appFormService.getCreditCardYears().subscribe(years => this.creditCardYears.set(years));
  }

  loadCountries(): void {
    this.appFormService.getCountries().subscribe(countries => this.countries.set(countries));
  }

  getStates(formGroupName: string): void {
    const formGroup: AbstractControl | null = this.form.get(formGroupName);
    const countryCode: string = formGroup?.value.country.code;


    this.appFormService.getStates(countryCode).subscribe(states => {
      formGroupName === 'shippingAddress' ? this.shippingAddressStates.set(states) : this.billingAddressStates.set(states);
      formGroup?.get('state')?.setValue(states[0])
    });
  }

  handleMonthsAndYears(): void {
    const creditCardFormGroup = this.form.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value?.expirationYear);

    const startMonth: number = currentYear === selectedYear ? new Date().getMonth() + 1 : 1;
    this.getCreditCardMonths(startMonth)

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
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();   // reveal every error at once
    //   return;
    // }
    const value = this.form.getRawValue();   // fully typed, no nulls
    console.log(value);
  }
}