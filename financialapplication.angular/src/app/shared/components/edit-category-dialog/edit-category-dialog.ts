import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../../../core/services/category.service';
import { UpdateCategoryDto } from '../../models/category.model';

// Assuming you have an interface like this for the existing category
export interface Category {
  id: string | number;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-category-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule, // Important for dialog directives
  ],
  templateUrl: './edit-category-dialog.html',
  styleUrls: ['./edit-category-dialog.css'],
})
export class EditCategoryDialog implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<EditCategoryDialog>);

  // Inject the data passed from the parent component
  public data: Category = inject(MAT_DIALOG_DATA);

  editForm!: FormGroup;

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

  ngOnInit(): void {
    // Pre-fill the form with the injected data
    this.editForm = this.fb.group({
      name: [this.data.name, [Validators.required, Validators.maxLength(50)]],
      description: [this.data.description, Validators.maxLength(200)],
      icon: [this.data.icon, Validators.required],
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedData = { ...this.data, ...this.editForm.value };

      // Call your update function here
      this.categoryService.updateCategory(updatedData as UpdateCategoryDto).subscribe({
        next: (response) => {
          // Close the dialog and pass back the updated data or a success flag
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error updating category', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
