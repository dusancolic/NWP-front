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
  isReadChecked: boolean = false;
  isCreateChecked: boolean = false;
  isDeleteChecked: boolean = false;
  isUpdateChecked: boolean = false;

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
      can_delete: [false]
    });
    this.resetData();
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

      const registerPost: UserCreateModel = {
        firstname: registerFirstname,
        lastname: registerLastname,
        username: registerEmail,
        password: registerPassword,
        can_create: can_create,
        can_read: can_read,
        can_delete: can_delete,
        can_update: can_update
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

