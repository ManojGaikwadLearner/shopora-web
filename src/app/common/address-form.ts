// common/address-form.ts
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Country } from '../services/models/country.model';
import { State } from '../services/models/state.model';
import { notOnlyWhitespace, PATTERNS } from './validators';

export function createAddressForm(fb: NonNullableFormBuilder) {
  return fb.group({
    country: fb.control<Country | null>(null, Validators.required),
    street: ['', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
    city: ['', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
    state: fb.control<State | null>(null, Validators.required),
    zipCode: ['', [Validators.required, Validators.pattern(PATTERNS.zipCode)]],
  });
}

export type AddressForm = ReturnType<typeof createAddressForm>;