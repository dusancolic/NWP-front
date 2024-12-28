import { Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { AllUsersComponent } from './user/components/all-users/all-users.component';
import { EditUserComponent } from './user/components/edit-user/edit-user.component';
import { AuthGuard } from './user/auth.guard';
import { CreateUserComponent } from './user/components/create-user/create-user.component';
import { PermissionGuard } from './user/permission.guard';
import { WithoutReadComponentComponent } from './user/components/without-read-component/without-read-component.component';
import { AllDishesComponent } from './components/dishes/all-dishes/all-dishes.component';
import { CreateDishComponent } from './components/dishes/create-dish/create-dish.component';
import { EditDishComponent } from './components/dishes/edit-dish/edit-dish.component';
import { AllErrorsComponent } from './components/all-errors/all-errors.component';
import { AllOrdersComponent } from './components/orders/all-orders/all-orders.component';
import { CreateOrderComponent } from './components/orders/create-order/create-order.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full'
    },
    {
        path: 'users', 
        component: AllUsersComponent, 
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_read'] }
        
    },
    {
        path : 'without-read', 
        component: WithoutReadComponentComponent
    },
    {
        path : 'login', 
        component: LoginComponent
    },
    {
        path: 'edit-user', 
        component: EditUserComponent, 
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_read', 'can_update'] }
    },
    {
        path: 'create-user', 
        component: CreateUserComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_read', 'can_create'] }
    },
    {
        path: 'dishes', 
        component: AllDishesComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'create-dish', 
        component: CreateDishComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_read', 'can_create'] }
    },
    {
        path: 'edit-dish', 
        component: EditDishComponent, 
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_read', 'can_update'] }
    },
    {
        path: 'errors',
        component: AllErrorsComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_place_order'] }
    },
    {
        path: 'orders',
        component: AllOrdersComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_search_order'] }
    },
    {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: { permissions: ['can_place_order'] }
    },
    {
        path: '**', 
        redirectTo: 'login'
    }
];
