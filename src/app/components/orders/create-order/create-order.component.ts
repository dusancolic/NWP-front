import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../../navigation/navigation.component';
import { DishService } from '../../../service/dish.service';
import { DishViewModel } from '../../../model/dish-model';
import { OrderService } from '../../../service/order.service';
import { OrderCreateModel, OrderScheduleModel } from '../../../model/order-model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { PermissionService } from '../../../service/permisions.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatRadioModule,
    NavigationComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  totalPrice: number = 0;

  createOrderForm!: FormGroup;
  dishes: DishViewModel[] = [];
  selectedDishes: Map<DishViewModel, number> = new Map();
  errorMessages = {
    scheduledFor: [
      { type: 'required', message: 'Order time is required' },
      { type: 'invalidDate', message: 'Order time must be in the future' }
    ],
  };
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private orderService: OrderService, private dishService: DishService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.createOrderForm = this.formBuilder.group({
      orderType: ['immediate', Validators.required],
      scheduledFor: [null],
    });
    this.getDishes();
    this.createOrderForm.get('orderType')?.valueChanges.subscribe((value) => {
      const scheduledForControl = this.createOrderForm.get('scheduledFor');
      if (value === 'scheduled') {
        scheduledForControl?.setValidators([Validators.required, this.futureDateValidator]);
      } else {
        scheduledForControl?.clearValidators();
      }
      scheduledForControl?.updateValueAndValidity();
    });

  }

  canSchedule(): boolean {
    return this.permissionService.hasPermission('can_schedule_order');
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const now = new Date();
    return selectedDate.getTime() > now.getTime() ? null : { invalidDate: true };
  }

  addDish(dish: DishViewModel) {
    const currentQuantity = this.selectedDishes.get(dish) || 0;
    this.selectedDishes.set(dish, currentQuantity + 1);
    this.calculateTotalPrice();
  }

  removeDish(dish: DishViewModel) {
    const currentQuantity = this.selectedDishes.get(dish) || 0;
    if (currentQuantity > 0) {
      this.selectedDishes.set(dish, currentQuantity - 1);
    }
    this.calculateTotalPrice();
  }

  getDishQuantity(dish: DishViewModel): number {
    return this.selectedDishes.get(dish) || 0;
  }

  calculateTotalPrice() {
    this.totalPrice = Array.from(this.selectedDishes.entries())
      .reduce((total, [dish, quantity]) => total + (dish.price * quantity), 0);
  }

  getForm(): FormGroup {
    return this.createOrderForm;
  }

  onSubmit(): void {
    if (this.createOrderForm.valid && this.totalPrice > 0) {
      const dishes: DishViewModel[] = [];
      this.selectedDishes.forEach((quantity, dish) => {
        for (let i = 0; i < quantity; i++) {
          dishes.push(dish);
        }
      });
      const scheduledFor = this.createOrderForm.value.scheduledFor;

      const createOrderPost: OrderCreateModel = {
        dishes: dishes,
      };

      const scheduleOrderPost: OrderScheduleModel = {
        dishes: dishes,
        scheduledFor: scheduledFor
      }
      if (this.createOrderForm.value.orderType == "immediate") {
        this.subscriptions.push(this.orderService.addOrder(createOrderPost)
          .subscribe(
            response => {
              if (response) {
                this.createOrderForm.reset();
                this.router.navigate(['/orders']);
              }
            },
            error => {
              console.error('Error while ordering:', error);
              this.errorMessage = 'Error while ordering. Try again!';
            }
          ));
      }

      else {
        this.subscriptions.push(this.orderService.scheduleOrder(scheduleOrderPost)
          .subscribe(
            response => {
              if (response) {
                this.createOrderForm.reset();
                this.router.navigate(['/orders']);
              }
            },
            error => {
              console.error('Error while scheduling order:', error);
              this.errorMessage = 'Error while scheduling order. Try again!';
              
            }
          ));
      }
    }
  }


  getDishes() {
    this.subscriptions.push(this.dishService.getDishesFromMenu(0, 10000).subscribe(res => {
      this.dishes = res.content;
    }));
  }

  

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}

