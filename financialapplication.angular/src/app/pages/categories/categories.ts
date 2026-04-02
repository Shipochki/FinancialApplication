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
import { Router } from '@angular/router';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryDialog } from '../../shared/components/edit-category-dialog/edit-category-dialog';

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
  private route = inject(Router);
  private dialog = inject(MatDialog);

  categories = signal<GetCategoryDto[]>([]);
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
        this.categories.set(data);
        console.log('Categories loaded:', this.categories());
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
    this.route.navigate(['/create-category']);
  }

  onEditCategory(category: GetCategoryDto): void {
    // Hook up your MatDialog here to edit the custom category
    const dialogRef = this.dialog.open(EditCategoryDialog, {
      width: '500px',
      data: category, // This passes the data to the MAT_DIALOG_DATA in the pop-up
      autoFocus: false, // Prevents the first input from focusing immediately if you prefer
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog was closed after saving', result);
        this.categoryService.updateCategory(result).subscribe({
          next: () => {
            console.log('Category updated successfully');
            const index = this.categories().findIndex((c) => c.id === result.id);

            if (index !== -1) {
              // Replace the old category with the new one in the array
              this.categories.update((categories) => {
                categories[index] = result;
                return categories;
              });
            }
          },
          error: (err) => {
            console.error('Error updating category', err);
          },
        });
      } else {
        console.log('Dialog was cancelled or closed without saving');
      }
    });
  }

  onDeleteCategory(categoryId: string, name: string): void {
    // Hook up your confirmation dialog and delete API call
    if (categoryId) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '400px',
        disableClose: true,
        // Pass the specific text for this scenario here:
        data: {
          title: `Delete Category: ${name}`,
          message: 'Are you sure you want to permanently delete this category?',
          confirmText: 'Delete',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed && categoryId) {
          // 3. Trigger the delete service call
          this.categoryService.deleteCategory(categoryId).subscribe({
            next: () => {
              console.log('Account deleted successfully');
              // Navigate back to the account list after deletion
              this.loadCategories();
            },
            error: (err) => {
              console.error('Error deleting account', err);
              // Optional: You could add a MatSnackBar here to show the user an error occurred
            },
          });
        }
      });
    }
  }
}
