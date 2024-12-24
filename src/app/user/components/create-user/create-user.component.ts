import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LoginViewModel, UserCreateModel } from '../../../model/user-model';
import { UserService } from '../../../service/user.service';
import { NavigationComponent } from '../../../components/navigation/navigation.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavigationComponent
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  registerFailed: boolean = false;
  showPassword: boolean = false;

  registerForm!: FormGroup;
  errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ],
    firstname: [
      { type: 'required', message: 'First name is required' },
      { type: 'minlength', message: 'First name must be at least 2 characters long' }
    ],
    lastname: [
      { type: 'required', message: 'Last name is required' },
      { type: 'minlength', message: 'Last name must be at least 2 characters long' }
    ]
  };
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      can_create: [false],
      can_read: [false],
      can_update: [false],
      can_delete: [false],
      can_search_order: [false],
      can_place_order: [false],
      can_cancel_order: [false],
      can_track_order: [false],
      can_schedule_order: [false]
    });
    this.resetData();
    this.registerForm.valueChanges.subscribe(values => {

      if ((values.can_create || values.can_update || values.can_delete) && !values.can_read) {
        this.registerForm.patchValue({ can_read: true,
          can_place_order: true,
          can_search_order: true,
          can_cancel_order: true,
          can_track_order: true,
          can_schedule_order: true
         }, { emitEvent: false });
      }
    
      if (values.can_read) {
        this.registerForm.patchValue({
          can_place_order: true,
          can_search_order: true,
          can_cancel_order: true,
          can_track_order: true,
          can_schedule_order: true
        }, { emitEvent: false });
      }
    
      if (
        values.can_search_order ||
        values.can_cancel_order ||
        values.can_track_order ||
        values.can_schedule_order
      ) {
        this.registerForm.patchValue({ can_place_order: true }, { emitEvent: false });
      }
    });
    
    
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerEmail = this.registerForm.value.email;
      const registerPassword = this.registerForm.value.password;
      const registerFirstname = this.registerForm.value.firstname;
      const registerLastname = this.registerForm.value.lastname
      const can_read = this.registerForm.value.can_read;
      const can_create = this.registerForm.value.can_create;
      const can_delete = this.registerForm.value.can_delete;
      const can_update = this.registerForm.value.can_update;
      const can_search_order = this.registerForm.value.can_search_order;
      const can_place_order = this.registerForm.value.can_place_order;
      const can_cancel_order = this.registerForm.value.can_cancel_order;
      const can_track_order = this.registerForm.value.can_track_order;
      const can_schedule_order = this.registerForm.value.can_schedule_order;

      const registerPost: UserCreateModel = {
        firstname: registerFirstname,
        lastname: registerLastname,
        username: registerEmail,
        password: registerPassword,
        can_create: can_create,
        can_read: can_read,
        can_delete: can_delete,
        can_update: can_update,
        can_search_order: can_search_order,
        can_place_order: can_place_order,
        can_cancel_order: can_cancel_order,
        can_track_order: can_track_order,
        can_schedule_order: can_schedule_order
      };

      this.subscriptions.push(this.userService.addUser(registerPost)
        .subscribe(
          response => {
            if (response) {
              this.registerFailed = false;
              this.registerForm.reset();
              this.router.navigate(['/users']);
            } else {
              this.registerFailed = true;
            }
          },
          error => {
            console.error('Error during register:', error);
            this.errorMessage = 'Error creating user. Try again!';
            this.registerFailed = true;
          }
        ));
    } else {
      this.registerFailed = true;
    }
  }

  resetData() {
    this.registerFailed = false;
    this.showPassword = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}

