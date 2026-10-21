import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  minlength: 'Too short.',
  maxlength: 'Too long.',
  email: 'Enter a valid email address.',
  pattern: 'Check the format.',
};

@Component({
  imports: [],
  selector: 'app-field-row',
  styleUrl: './field-row.scss',
  templateUrl: './field-row.html',
})
export class FieldRow {
  readonly label = input.required<string>();
  readonly for = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  /** Override any default message, e.g. { minlength: 'At least 16 digits.' } */
  readonly messages = input<Record<string, string>>({});

  protected readonly errorMessage = computed(() => {
    const ctrl = this.control();
    if (!ctrl?.touched || !ctrl.invalid || !ctrl.errors) return null;
    const key = Object.keys(ctrl.errors)[0];
    return this.messages()[key] ?? DEFAULT_MESSAGES[key] ?? 'Check this field.';
  });
}
