import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutReadComponentComponent } from './without-read-component.component';

describe('WithoutReadComponentComponent', () => {
  let component: WithoutReadComponentComponent;
  let fixture: ComponentFixture<WithoutReadComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithoutReadComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithoutReadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
