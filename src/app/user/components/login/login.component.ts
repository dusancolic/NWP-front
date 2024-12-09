import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LoginViewModel, PermissionModel } from '../../../model/user-model';
import { UserService } from '../../../service/user.service';
import { PermissionService } from '../../../service/permisions.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  loginFailed: boolean = false;
  showPassword: boolean = false;
  loginForm!: FormGroup;
  errorMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' }
    ],
  };
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if(token)
      this.router.navigate(['/users']);
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.resetData();
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const loginEmail = this.loginForm.value.email;
      const loginPassword = this.loginForm.value.password;
      const loginPost: LoginViewModel = {
        username: loginEmail,
        password: loginPassword
      };

      this.subscriptions.push(this.userService.login(loginPost)
        .subscribe(
          response => {
            if (response) {
              this.loginFailed = false;
              this.loginForm.reset();
              this.permissionService.setUserPermissions(new PermissionModel(response.can_create, response.can_read, response.can_update, response.can_delete));
              
              this.saveUserDataToLocalStorage(response);

              this.router.navigate(['/users']);
            } else {
              this.loginFailed = true;
            }
          },
          error => {
            console.error('Error during login:', error);
            this.errorMessage = 'User with these credentials does not exist. Please try again.';
            this.loginFailed = true;
          }
        ));
    } else {
      this.loginFailed = true;
    }
  }


  saveUserDataToLocalStorage(response: any) {
    localStorage.setItem('token', response.jwt.toString());
  }

  resetData() {
    this.loginFailed = false;
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

