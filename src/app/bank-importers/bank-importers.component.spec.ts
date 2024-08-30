import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankImportersComponent } from './bank-importers.component';

describe('BankImportersComponent', () => {
  let component: BankImportersComponent;
  let fixture: ComponentFixture<BankImportersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankImportersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankImportersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
