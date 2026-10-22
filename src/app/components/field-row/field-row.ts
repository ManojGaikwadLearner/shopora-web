import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { EMPTY, switchMap } from 'rxjs';

const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  whitespace: 'Enter some actual text, not just spaces.',
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
  readonly messages = input<Record<string, string>>({});

  /** Ticks whenever the bound control's value, status or touched state changes. */
  private readonly controlEvents = toSignal(
    toObservable(this.control).pipe(switchMap(ctrl => ctrl ? ctrl.events : EMPTY)),
  );

  protected readonly errorMessage = computed(() => {
    this.controlEvents();                 // the dependency that makes this reactive
    const ctrl = this.control();
    if (!ctrl?.touched || !ctrl.invalid || !ctrl.errors) return null;
    const key = Object.keys(ctrl.errors)[0];
    return this.messages()[key] ?? DEFAULT_MESSAGES[key] ?? 'Check this field.';
  });
}
