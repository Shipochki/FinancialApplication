import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BudgetService } from '../../core/services/budget.service';
import { GetBudgetDto } from '../../shared/models/budget.model';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

// Assume these are imported from your actual paths

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './budgets.html',
  styleUrls: ['./budgets.css'],
})
export class Budgets implements OnInit {
  private route = inject(ActivatedRoute);
  private budgetService = inject(BudgetService);
  private authService = inject(GlobalAuthService);
  private router = inject(Router);

  accountId: string | null = null;
  budgets = signal<GetBudgetDto[]>([]);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Subscribe to param changes to capture the accountId from the URL
      this.route.paramMap.subscribe((params) => {
        this.accountId = params.get('accountId');
        if (this.accountId) {
          this.loadBudgets(this.accountId);
        }
      });
    }
  }

  loadBudgets(id: string): void {
    this.budgetService.getAllBudgetsByAccountId(id).subscribe({
      next: (data) => {
        this.budgets.set(data);
      },
      error: (err) => {
        console.error('Failed to load budgets', err);
      },
    });
  }

  onAddBudget(): void {
    // Placeholder: Open modal or navigate to add budget form
    this.router.navigate([`/create-budget/${this.accountId}`]);
  }

  onEditBudget(budget: GetBudgetDto): void {
    console.log('Editing budget:', budget.id);
  }

  onDeleteBudget(budget: GetBudgetDto): void {
    console.log('Deleting budget:', budget.id);
  }
}
