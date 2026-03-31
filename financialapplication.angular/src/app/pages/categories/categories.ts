import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService } from '../../core/services/category.service';
import { GetCategoryDto } from '../../shared/models/category.model';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private authService = inject(GlobalAuthService);

  categories: GetCategoryDto[] = [];
  isLoading = signal(true);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (data: GetCategoryDto[]) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.isLoading.set(false);
      },
    });
  }

  onCreateCategory(): void {
    // Hook up your MatDialog here to create a new category
    console.log('Trigger create category flow');
  }

  onEditCategory(category: GetCategoryDto): void {
    // Hook up your MatDialog here to edit the custom category
    console.log('Trigger edit category flow for:', category.name);
  }

  onDeleteCategory(categoryId: string): void {
    // Hook up your confirmation dialog and delete API call
    console.log('Trigger delete for category ID:', categoryId);
  }
}
