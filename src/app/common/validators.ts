import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PATTERNS = {
    email: /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/,
    zipCode: /^\d{6}$/
}

/**
 * Rejects values that are only whitespace.
 * An empty string passes — that is Validators.required's job, so the two compose
 * without producing two error messages for the same empty field.
 */
export const notOnlyWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (typeof value !== 'string' || value.length === 0) return null;
  return value.trim().length === 0 ? { whitespace: true } : null;
};