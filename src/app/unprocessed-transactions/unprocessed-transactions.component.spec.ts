import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedTransactionsComponent } from './unprocessed-transactions.component';

describe('UnprocessedTransactionsComponent', () => {
  let component: UnprocessedTransactionsComponent;
  let fixture: ComponentFixture<UnprocessedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnprocessedTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnprocessedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
