import { Component, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '../../service/permisions.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private dialog: MatDialog, private permissionService: PermissionService) { }

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  firstname: string = '';
  lastname: string = '';
  permissions: any[] = [];

  userRoutes = [
    { name: 'Users', url: '/users', icon: 'group' },
    { name: 'Create User', url: '/create-user', icon: 'person_add_alt'},
    { name: 'Dishes', url: '/dishes', icon: 'fastfood' },
    { name: 'Create Dish', url: '/create-dish', icon: 'soup_kitchen'},
    { name: 'Error Log', url: '/errors', icon: 'error' },
    { name: 'Order', url: '/order', icon: 'shopping_cart' },
  ];

  userRoutesWithoutCreateUser = [
    { name: 'Users', url: '/users', icon: 'group' },
    { name: 'Dishes', url: '/dishes', icon: 'fastfood' },
    { name: 'Error Log', url: '/errors', icon: 'error' },
    { name: 'Order', url: '/order', icon: 'shopping_cart' },
  ];

  withoutUserPermissions = [
    { name: 'Dishes', url: '/dishes', icon: 'fastfood' },
    { name: 'Error Log', url: '/errors', icon: 'error' },
    { name: 'Order', url: '/order', icon: 'shopping_cart' },
  ];

  routes: any[] = this.userRoutes;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      this.firstname = localStorage.getItem('firstName') || '';
      this.lastname = localStorage.getItem('lastName') || '';
      this.permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

      this.setRoutes();
    }
  }

  setRoutes() {

    if(!this.permissionService.hasPermission('can_place_order'))
      this.routes = [];  
    else if(this.permissionService.hasPermission('can_read') && this.permissionService.hasPermission('can_place_order'))
      this.permissionService.hasPermission('can_create') ? this.routes = this.userRoutes : this.routes = this.userRoutesWithoutCreateUser;
    else if(this.permissionService.hasPermission('can_place_order') && !this.permissionService.hasPermission('can_read'))
      this.routes = this.withoutUserPermissions;
   
  }

  toggleMenu() {
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}