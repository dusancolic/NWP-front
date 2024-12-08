import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { UserDeleteModel, UserViewModel } from '../../../model/user-model';
import { UserService } from '../../../service/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { PermissionService } from '../../../service/permisions.service';
import { NavigationComponent } from '../../../components/navigation/navigation.component';


const HOME = '/home';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    MatPaginatorModule,
    MatSortModule,
    NavigationComponent,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
})
export class AllUsersComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0;
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'username', 'can_create', 'can_read', 'can_update', 'can_delete', 'deleted', 'actions'];
  dataSource: MatTableDataSource<UserViewModel> = new MatTableDataSource<UserViewModel>([]);
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private userService: UserService, private router: Router, private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.subscriptions.push(this.userService.getUsers(this.pageIndex, this.pageSize).subscribe(res => {
      this.dataSource.data = res.content;
      this.totalUsers = res.totalElements;
    }));
  }


  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  canDelete(): Boolean {
    return this.permissionService.hasPermission('can_delete');
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

  navigateToEditUser(user: UserViewModel){
    this.router.navigate(['/edit-user'], { state: { user } });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
  }
}