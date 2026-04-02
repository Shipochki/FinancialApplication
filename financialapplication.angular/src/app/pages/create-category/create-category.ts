import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../core/services/category.service';
import { CreateCategoryDto } from '../../shared/models/category.model';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './create-category.html',
  styleUrls: ['./create-category.css'],
})
export class CreateCategory implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(Router);
  readonly topIcons: string[] = [
    'shopping_cart',
    'restaurant',
    'directions_car',
    'flight',
    'pets',
    'local_hospital',
    'fitness_center',
    'school',
    'work',
    'attach_money',
    'credit_card',
    'receipt',
    'account_balance',
    'category',
    'home',
    'favorite',
    'star',
    'build',
    'emoji_objects',
    'sports_esports',
  ];

  categoryForm!: FormGroup;

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      icon: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData: CreateCategoryDto = this.categoryForm.value;

      this.categoryService.createCategory(categoryData).subscribe({
        next: (response) => {
          // Handle successful creation (e.g., show a snackbar, navigate back)
          console.log('Category created successfully', response);
          this.categoryForm.reset();
          this.route.navigate(['/categories']);
        },
        error: (error) => {
          // Handle error gracefully
          console.error('Error creating category', error);
        },
      });
    }
  }
}
