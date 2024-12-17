import { Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { AllUsersComponent } from './user/components/all-users/all-users.component';
import { EditUserComponent } from './user/components/edit-user/edit-user.component';
import { AuthGuard } from './user/auth.guard';
import { CreateUserComponent } from './user/components/create-user/create-user.component';
import { PermissionGuard } from './user/permission.guard';
import { WithoutReadComponentComponent } from './user/components/without-read-component/without-read-component.component';
import { AllDishesComponent } from './dishes/all-dishes/all-dishes.component';
import { CreateDishComponent } from './dishes/create-dish/create-dish.component';
import { EditDishComponent } from './dishes/edit-dish/edit-dish.component';

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
        path: '**', 
        redirectTo: 'login'
    }
];
