import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GetTransactionDto } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-card',
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './transaction-card.html',
  styleUrl: './transaction-card.css',
  standalone: true,
})
export class TransactionCard implements OnInit{
  @Input({ required: true}) transaction!: GetTransactionDto;
  private route = inject(Router);

  ngOnInit(): void {
    
  }

  onClickTransaction(){
    this.route.navigate([`/transaction/${this.transaction.id}`]);
  }

  get isIncome(): boolean {
    return this.transaction.type === 0;
  }
}
