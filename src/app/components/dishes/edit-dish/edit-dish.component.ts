import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../../navigation/navigation.component';
import { DishService } from '../../../service/dish.service';
import { DishEditModel, DishViewModel } from '../../../model/dish-model';


@Component({
  selector: 'app-edit-dish',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavigationComponent
  ],
  templateUrl: './edit-dish.component.html',
  styleUrl: './edit-dish.component.css'
})
export class EditDishComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  editFailed: boolean = false;

  editForm!: FormGroup;
  errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' }
    ],
    price: [
      { type: 'required', message: 'Price is required' },
    ]
  };
  errorMessage!: string;
  id: number = 0;

  constructor(private formBuilder: FormBuilder, private dishService: DishService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const dish = history.state.dish;
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
    });
  
    this.editDish(dish);
    this.resetData();
  
    
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const changeName = this.editForm.value.name;
      const changePrice = this.editForm.value.price
      const changePost: DishEditModel = {
        id: this.id,
        name: changeName,
        price: changePrice,
      };
      this.subscriptions.push(this.dishService.editDish(changePost)
        .subscribe(
          response => {
            if (response) {
              this.editFailed = false;
              this.editForm.reset();
              this.router.navigate(['/dishes']);
            } else {
              this.editFailed = true;
            }
          },
          error => {
            console.error('Error during changing:', error);
            this.errorMessage = 'Error changing dish. Try again!';
            this.editFailed = true;
          }
        ));
    } else {
      this.editFailed = true;
    }
  }

  resetData() {
    this.editFailed = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  editDish(dish: DishViewModel): void {
    this.id = dish.id;
    this.editForm.controls['name'].setValue(dish.name);
    this.editForm.controls['price'].setValue(dish.price);
  }
}
