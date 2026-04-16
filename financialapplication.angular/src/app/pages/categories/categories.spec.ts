import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

import { Categories } from './categories';
import { CategoryService } from '../../core/services/category.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { GetCategoryDto } from '../../shared/models/category.model';

type SpyFunction<T extends (...args: any[]) => any> = T & { calls: any[][] };

function createSpyFn<T extends (...args: any[]) => any>(impl: T): SpyFunction<T> {
  let spy: SpyFunction<T>;
  spy = ((...args: any[]) => {
    spy.calls.push(args);
    return impl(...args);
  }) as SpyFunction<T>;
  spy.calls = [];
  return spy;
}

describe('Categories', () => {
  let component: Categories;
  let fixture: ComponentFixture<Categories>;
  let categoryService: {
    getAllCategories: SpyFunction<() => any>;
    deleteCategory: SpyFunction<(id: string) => any>;
    updateCategory: SpyFunction<(category: GetCategoryDto) => any>;
  };
  let authService: { isLoggedIn: SpyFunction<() => boolean> };
  let router: { navigate: SpyFunction<(commands: any[]) => any> };
  let dialog: { open: SpyFunction<(component: any, config: any) => any> };

  function createCategory(): GetCategoryDto {
    return {
      id: 'cat-1',
      name: 'Category 1',
      description: 'Test category',
      icon: 'test-icon',
      isGlobal: false,
    };
  }

  function createCategories(): GetCategoryDto[] {
    return [createCategory()];
  }

  beforeEach(async () => {
    categoryService = {
      getAllCategories: createSpyFn(() => of(createCategories())),
      deleteCategory: createSpyFn(() => of(void 0)),
      updateCategory: createSpyFn((category: GetCategoryDto) => of(category)),
    };
    authService = {
      isLoggedIn: createSpyFn(() => false),
    };
    router = {
      navigate: createSpyFn(() => true),
    };
    dialog = {
      open: createSpyFn(() => ({ afterClosed: () => of(false) })),
    };

    await TestBed.configureTestingModule({
      imports: [Categories, RouterTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: GlobalAuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Categories);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories when the user is logged in', () => {
    const categories = createCategories();
    authService.isLoggedIn = createSpyFn(() => true);
    categoryService.getAllCategories = createSpyFn(() => of(categories));

    fixture.detectChanges();

    expect(categoryService.getAllCategories.calls).toEqual([[]]);
    expect(component.categories()).toEqual(categories);
    expect(component.isLoading()).toBe(false);
  });

  it('should not load categories when the user is not logged in', () => {
    const categories = createCategories();
    authService.isLoggedIn = createSpyFn(() => false);
    categoryService.getAllCategories = createSpyFn(() => of(categories));

    fixture.detectChanges();

    expect(categoryService.getAllCategories.calls.length).toBe(0);
    expect(component.categories()).toEqual([]);
    expect(component.isLoading()).toBe(true);
  });

  it('should navigate to create category when create is clicked', () => {
    component.onCreateCategory();

    expect(router.navigate.calls).toEqual([[['/create-category']]]);
  });

  it('should update category when edit dialog returns a result', () => {
    const categories = createCategories();
    component.categories.set(categories);
    const updatedCategory: GetCategoryDto = {
      ...categories[0],
      name: 'Updated Category',
    };
    const dialogRef = { afterClosed: () => of(updatedCategory) };
    dialog.open = createSpyFn(() => dialogRef);
    categoryService.updateCategory = createSpyFn(() => of(updatedCategory));

    component.onEditCategory(categories[0]);

    expect(dialog.open.calls.length).toBe(1);
    expect(categoryService.updateCategory.calls).toEqual([[updatedCategory]]);
    expect(component.categories()[0].name).toBe('Updated Category');
  });

  it('should not update category when edit dialog is cancelled', () => {
    const categories = createCategories();
    component.categories.set(categories);
    const dialogRef = { afterClosed: () => of(false) };
    dialog.open = createSpyFn(() => dialogRef);
    categoryService.updateCategory = createSpyFn(() => of(categories[0]));

    component.onEditCategory(categories[0]);

    expect(dialog.open.calls.length).toBe(1);
    expect(categoryService.updateCategory.calls.length).toBe(0);
    expect(component.categories()[0].name).toBe('Category 1');
  });

  it('should delete category when confirmation is received', () => {
    const categories = createCategories();
    component.categories.set(categories);
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open = createSpyFn(() => dialogRef);
    categoryService.deleteCategory = createSpyFn(() => of(void 0));
    categoryService.getAllCategories = createSpyFn(() => of(categories));

    component.onDeleteCategory('cat-1', 'Category 1');

    expect(dialog.open.calls.length).toBe(1);
    expect(categoryService.deleteCategory.calls).toEqual([['cat-1']]);
    expect(categoryService.getAllCategories.calls.length).toBe(1);
  });

  it('should not delete category when confirmation is cancelled', () => {
    const categories = createCategories();
    component.categories.set(categories);
    const dialogRef = { afterClosed: () => of(false) };
    dialog.open = createSpyFn(() => dialogRef);
    categoryService.deleteCategory = createSpyFn(() => of(void 0));
    categoryService.getAllCategories = createSpyFn(() => of(categories));

    component.onDeleteCategory('cat-1', 'Category 1');

    expect(dialog.open.calls.length).toBe(1);
    expect(categoryService.deleteCategory.calls.length).toBe(0);
    expect(categoryService.getAllCategories.calls.length).toBe(0);
  });
});
