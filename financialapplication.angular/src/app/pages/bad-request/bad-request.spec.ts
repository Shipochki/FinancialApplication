import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BadRequest } from './bad-request';

describe('BadRequest', () => {
  let component: BadRequest;
  let fixture: ComponentFixture<BadRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadRequest, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BadRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
