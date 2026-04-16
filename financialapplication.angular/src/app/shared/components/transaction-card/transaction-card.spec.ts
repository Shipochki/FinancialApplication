import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TransactionCard } from './transaction-card';

describe('TransactionCard', () => {
  let component: TransactionCard;
  let fixture: ComponentFixture<TransactionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCard, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCard);
    component = fixture.componentInstance;
    component.transaction = {
      id: 'tx1',
      type: 0,
      amount: 100,
      date: '2026-01-01',
      description: 'Test transaction',
      category: { id: 'cat1', name: 'Test Category', description: '', icon: 'category' },
      accountId: 'acc1',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    } as any;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
