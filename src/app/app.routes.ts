import { Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { AllUsersComponent } from './user/components/all-users/all-users.component';
import { EditUserComponent } from './user/components/edit-user/edit-user.component';
import { AuthGuard } from './user/auth.guard';
import { CreateUserComponent } from './user/components/create-user/create-user.component';
import { PermissionGuard } from './user/permission.guard';
import { WithoutReadComponentComponent } from './user/components/without-read-component/without-read-component.component';

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
        path: '**', 
        redirectTo: 'login'
    }
];
