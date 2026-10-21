import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldRow } from './field-row';

describe('FieldRow', () => {
  let component: FieldRow;
  let fixture: ComponentFixture<FieldRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldRow],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
