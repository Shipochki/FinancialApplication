import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Categories } from './categories';
import { CategoryService } from '../../core/services/category.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;

  const categoryService = {
    getAllCategories: () => of([]),
    deleteCategory: () => of(void 0),
    updateCategory: () => of(void 0),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categories, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
