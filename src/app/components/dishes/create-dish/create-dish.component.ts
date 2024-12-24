import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../../navigation/navigation.component';
import { DishService } from '../../../service/dish.service';
import { DishCreateModel } from '../../../model/dish-model';


@Component({
  selector: 'app-create-dish',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavigationComponent
  ],
  templateUrl: './create-dish.component.html',
  styleUrl: './create-dish.component.css'
})
export class CreateDishComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  createFailed: boolean = false;
  
  registerForm!: FormGroup;
  errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' }
    ],
    price: [
      { type: 'required', message: 'Price is required' },
    ],
  };
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private dishService: DishService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
    });
    this.resetData();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerName = this.registerForm.value.name;
      const registerPrice = this.registerForm.value.price

      const registerPost: DishCreateModel = {
        name: registerName,
        price: registerPrice,
      };

      this.subscriptions.push(this.dishService.addDish(registerPost)
        .subscribe(
          response => {
            if (response) {
              this.createFailed = false;
              this.registerForm.reset();
              this.router.navigate(['/dishes']);
            } else {
              this.createFailed = true;
            }
          },
          error => {
            console.error('Error during creating:', error);
            this.errorMessage = 'Error creating dish. Try again!';
            this.createFailed = true;
          }
        ));
    } else {
      this.createFailed = true;
    }
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

