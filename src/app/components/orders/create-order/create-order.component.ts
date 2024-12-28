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


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatRadioModule,
    NavigationComponent,
    MatTableModule,
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
  createFailed: boolean = false;

  createOrderForm!: FormGroup;
  dishes: DishViewModel[] = [];
  selectedDishes: DishViewModel[] = [];
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
      dishes: [[], Validators.required],
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

    this.resetData();
  }

  canSchedule(): boolean {
    return this.permissionService.hasPermission('can_schedule_order');
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const now = new Date();
    return selectedDate.getTime() > now.getTime() ? null : { invalidDate: true };
  }


  getForm(): FormGroup {
    return this.createOrderForm;
  }

  onSubmit(): void {
    if (this.createOrderForm.valid) {
      const dishes = this.createOrderForm.value.dishes;
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
                this.createFailed = false;
                this.createOrderForm.reset();
                this.router.navigate(['/orders']);
              } else {
                this.createFailed = true;
              }
            },
            error => {
              console.error('Error while ordering:', error);
              this.errorMessage = 'Error while ordering. Try again!';
              this.createFailed = true;
            }
          ));
      }

      else {
        this.subscriptions.push(this.orderService.scheduleOrder(scheduleOrderPost)
          .subscribe(
            response => {
              if (response) {
                this.createFailed = false;
                this.createOrderForm.reset();
                this.router.navigate(['/orders']);
              } else {
                this.createFailed = true;
              }
            },
            error => {
              console.error('Error while scheduling order:', error);
              this.errorMessage = 'Error while scheduling order. Try again!';
              this.createFailed = true;
            }
          ));
      }
    }
    else {
      this.createFailed = true;
    }
  }

  toggleOnDishSelection(dish: DishViewModel): void {

    if (this.selectedDishes.includes(dish))
      this.selectedDishes = this.selectedDishes.filter(d => d !== dish);
    else
      this.selectedDishes.push(dish);
    this.totalPrice = this.selectedDishes.reduce((total: number, dish: any) => total + dish.price, 0);
  }

  getDishes() {
    this.subscriptions.push(this.dishService.getDishesFromMenu(0, 10000).subscribe(res => {
      this.dishes = res.content;
    }));
  }

  resetData() {
    this.createFailed = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}

