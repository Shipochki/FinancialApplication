import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { EditCategoryDialog } from './edit-category-dialog';
import { CategoryService } from '../../../core/services/category.service';

describe('EditCategoryDialog', () => {
  let component: EditCategoryDialog;
  let fixture: ComponentFixture<EditCategoryDialog>;

  const categoryService = {
    updateCategory: () => of({}),
  };
  const dialogRef = {
    close: () => {},
  };
  const dialogData = {
    id: '1',
    name: 'Test Category',
    description: 'Test description',
    icon: 'category',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategoryDialog],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
