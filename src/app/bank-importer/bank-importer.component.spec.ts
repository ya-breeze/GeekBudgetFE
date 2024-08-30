import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankImporterComponent } from './bank-importer.component';

describe('BankImporterComponent', () => {
  let component: BankImporterComponent;
  let fixture: ComponentFixture<BankImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankImporterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
