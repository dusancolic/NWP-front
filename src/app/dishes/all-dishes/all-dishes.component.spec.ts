import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDishesComponent } from './all-dishes.component';

describe('AllDishesComponent', () => {
  let component: AllDishesComponent;
  let fixture: ComponentFixture<AllDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
