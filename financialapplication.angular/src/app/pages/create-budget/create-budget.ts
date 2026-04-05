import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';
import { GetCategoryDto } from '../../shared/models/category.model';
import { CreateBudgetDto } from '../../shared/models/budget.model';

@Component({
  selector: 'app-budget-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './create-budget.html',
  styleUrls: ['./create-budget.css'],
})
export class CreateBudget implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private budgetService = inject(BudgetService);
  private categoryService = inject(CategoryService);

  budgetForm!: FormGroup;
  accountId: string = '';
  categories: GetCategoryDto[] = [];

  budgetTypes = [
    {
      value: 0,
      label: 'Unspecified',
      description: 'General budget with no specific classification.',
    },
    { value: 1, label: 'Operating', description: 'Day-to-day operational expenses and revenues.' },
    { value: 2, label: 'Capital', description: 'Long-term investments and major asset purchases.' },
    {
      value: 3,
      label: 'Cash Flow',
      description: 'Tracking the exact timing of cash inflows and outflows.',
    },
    {
      value: 4,
      label: 'Contingency',
      description: 'Emergency funds reserved for unexpected costs.',
    },
    { value: 5, label: 'Sinking Fund', description: 'Gradual saving for a known future expense.' },
    {
      value: 6,
      label: 'Project',
      description: 'Isolated budget for a specific, temporary project.',
    },
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.accountId = params.get('accountId') || '';
      this.initForm();
      this.loadCategories();
    });
  }

  private initForm(): void {
    this.budgetForm = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      type: [0, Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  onSubmit(): void {
    if (this.budgetForm.valid && this.accountId) {
      const formValue = this.budgetForm.value;

      const payload: CreateBudgetDto = {
        name: formValue.name,
        amount: formValue.amount,
        description: formValue.description,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        type: formValue.type,
        categoryId: formValue.categoryId,
        accountId: this.accountId,
      };

      this.budgetService.createBudget(payload).subscribe({
        next: () => {
          this.router.navigate(['/budgets', this.accountId]);
        },
        error: (err) => {
          console.error('Error creating budget:', err);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/budgets', this.accountId]);
  }
}
