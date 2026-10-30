import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripePayment } from './stripe-payment';

describe('StripePayment', () => {
  let component: StripePayment;
  let fixture: ComponentFixture<StripePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(StripePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
