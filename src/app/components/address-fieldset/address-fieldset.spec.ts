import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressFieldset } from './address-fieldset';

describe('AddressFieldset', () => {
  let component: AddressFieldset;
  let fixture: ComponentFixture<AddressFieldset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFieldset],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressFieldset);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
