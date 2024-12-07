import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { get } from 'http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { UserDeleteModel, UserViewModel } from '../../model/model';
import { UserService } from '../../service/user.service';


const HOME = '/home';

@Component({
  selector: 'app-all-users-list',
  standalone: true,
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    LoginComponent,
  ]
})
export class AllUsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roleType', 'ban'];
  //dataSource: MatTableDataSource<UserViewModel> = new MatTableDataSource<UserViewModel>([]);
  subscriptions: Subscription[] = [];




  constructor(private userService: UserService, private router: Router) { }


  ngOnInit(): void {
    
  }

  getUsers() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('token');

      this.subscriptions.push(this.userService.getUsers().subscribe(res => {
       // this.dataSource.data = res.content;
       // this.dataSource.paginator = this.paginator;
      //  this.dataSource.sort = this.sort;
      }));
    } else {
      console.error('sessionStorage is not available.');
    }
  }


  toggleDelete(user: UserViewModel): void {

    const userHelper : UserDeleteModel = {
      username: user.username,
      deleted: user.deleted
    };
    this.subscriptions.push(this.userService.deleteUser(userHelper).subscribe(
      (res: any) => {
        if (res) {
          this.getUsers();
        }
      },
      (error: any) => {
        console.log(`Error ${user.deleted ? 'undeleting' : 'deleting'} user:`, error);
      }
    ));

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}