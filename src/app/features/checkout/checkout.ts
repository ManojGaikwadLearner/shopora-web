import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppFormService } from '../../services/app-form.service';

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
  }

  getCreditCardMonths(startMonth = 1): void {
    this.appFormService.getCreditCardMonths(startMonth).subscribe(months => this.creditCardMonths.set(months));
  }

  getCreditCardYears(): void {
    this.appFormService.getCreditCardYears().subscribe(years => this.creditCardYears.set(years));
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
      this.form.controls.billingAddress.setValue(this.form.controls.shippingAddress.getRawValue())
    } else {
      this.form.controls.billingAddress.reset()
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