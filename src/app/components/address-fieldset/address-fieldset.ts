import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldRow } from '../field-row/field-row';
import { Country } from '../../services/models/country.model';
import { State } from '../../services/models/state.model';

@Component({
  imports: [ReactiveFormsModule, FieldRow],
  selector: 'app-address-fieldset',
  styleUrl: './address-fieldset.scss',
  templateUrl: './address-fieldset.html',
})
export class AddressFieldset {
  readonly group = input.required<FormGroup>();
  readonly legend = input('Address');
  readonly idPrefix = input.required<string>();
  readonly countries = input<Country[]>([]);
  readonly states = input<State[]>([]);
}
